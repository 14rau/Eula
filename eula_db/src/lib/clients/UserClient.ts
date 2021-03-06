import { EulaDb } from "../..";
import * as NodeCache from "node-cache";
import { User } from "../../entity/User";

export class UserClient {
    private cache = new NodeCache();
    constructor(private eulaDb: EulaDb) {

    }

    public async isUserBlocked(guild: string, userId: string) {
        // lvl 1 cache
        let value = this.cache.get<string>(`blockedUser_${userId}_${guild}`);
        if(!value) {
            // lvl 2 cache
            value = await this.eulaDb.redisClient.get(`blockedUser_${userId}_${guild}`);
            if(!value) {
                const repo = this.eulaDb.connection.getRepository(User);
                const user = await repo.findOne({ where: { anoUser: userId } });
                if(user) {
                    this.cache.set(userId, "true", 60000);
                    await this.eulaDb.redisClient.setEx(`blockedUser_${userId}_${guild}`, 60*60*24*30, "true");
                    value = "true";
                } else {
                    this.cache.set(userId, "false", 60000);
                    await this.eulaDb.redisClient.setEx(`blockedUser_${userId}_${guild}`, 60*60*24*30, "false");
                    value = "false";
                }
            }
        }
        return value === "true";
    }

    public async blockUser(guild: string, userId: string) {
        const repo = this.eulaDb.connection.getRepository(User);
        let user = await repo.findOne({ where: { anoUser: userId } });
        if(!user) {
           user = new User();
           user.anoUser = userId;
           user.guildId = guild;
           user.isBlocked = true;
           repo.save(user);
        } else {
            return;
        }

        // update caching
        this.cache.set<string>(`blockedUser_${userId}_${guild}`, "true", 60000);
        this.eulaDb.redisClient.setEx(`blockedUser_${userId}_${guild}`, 60*60*24*30, "true");
    }

    public async pardonUser(guild: string, userId: string) {
        const repo = this.eulaDb.connection.getRepository(User);
        repo.delete({ anoUser: userId });
        // update caching
        this.cache.set<string>(`blockedUser_${userId}_${guild}`, "false", 60000);
        this.eulaDb.redisClient.setEx(`blockedUser_${userId}_${guild}`, 60*60*24*30, "false");
    }
}