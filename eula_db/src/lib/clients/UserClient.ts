import { EulaDb } from "../..";
import * as NodeCache from "node-cache";
import { User } from "../../entity/User";

export class UserClient {
    private cache = new NodeCache();
    constructor(private eulaDb: EulaDb) {

    }

    public async isUserBlocked(guild: string, userId: string) {
        const hashed = this.eulaDb.encryptUserId(guild, userId)
        // lvl 1 cache
        let value = this.cache.get<string>(`blockedUser_${userId}`);
        if(!value) {
            // lvl 2 cache
            value = await this.eulaDb.redisClient.get(`blockedUser_${hashed}`);
            if(!value) {
                const hashed = this.eulaDb.encryptUserId(guild, userId);
                const repo = this.eulaDb.connection.getRepository(User);
                const user = await repo.findOne({ where: { anoUser: hashed } });
                if(user) {
                    this.cache.set(hashed, "true", 60000);
                    await this.eulaDb.redisClient.setEx(`blockedUser_${hashed}`, 60*60*24*30, "true");
                    value = "true";
                } else {
                    this.cache.set(hashed, "false", 60000);
                    await this.eulaDb.redisClient.setEx(`blockedUser_${hashed}`, 60*60*24*30, "false");
                    value = "false";
                }
            }
        }
        return value === "true";
    }

    public async blockUser(guild: string, userId: string) {
        const hashed = this.eulaDb.encryptUserId(guild, userId);
        const repo = this.eulaDb.connection.getRepository(User);
        let user = await repo.findOne({ where: { anoUser: hashed } });
        if(!user) {
           user = new User();
           user.anoUser = hashed;
           user.guildId = guild;
           repo.save(user);
        } else {
            return;
        }

        // update caching
        this.cache.set<string>(`blockedUser_${userId}`, "true", 60000);
        this.eulaDb.redisClient.setEx(`blockedUser_${hashed}`, 60*60*24*30, "true");
    }

    public async pardonUser(guild: string, userId: string) {
        const hashed = this.eulaDb.encryptUserId(guild, userId);
        const repo = this.eulaDb.connection.getRepository(User);
        repo.delete({ anoUser: hashed });
        // update caching
        this.cache.set<string>(`blockedUser_${userId}`, "false", 60000);
        this.eulaDb.redisClient.setEx(`blockedUser_${hashed}`, 60*60*24*30, "false");
    }
}