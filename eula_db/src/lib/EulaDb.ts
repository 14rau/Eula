import { createClient } from "redis";
import { RedisClientOptions, RedisClientType } from "redis/dist/lib/client";
import { RedisModules } from "redis/dist/lib/commands";
import { RedisLuaScripts } from "redis/dist/lib/lua-script";
import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { Guild } from "../entity/Guild";
import { Setting } from "../entity/Settings";
import { User } from "../entity/User";
import { SettingClient } from "./clients/SettingsClient";
import { UserClient } from "./clients/UserClient";
import * as crypto  from "crypto"
import { Warning } from "../entity/Warning";
import { WarningClient } from "./clients/WarningClient";

export interface EulaDbParams {
    connectionConfig: Partial<ConnectionOptions>
    redisClient: RedisClientOptions<RedisModules, RedisLuaScripts>,
    secret: string;
}


export class EulaDb {
    public redisClient: RedisClientType<RedisModules, RedisLuaScripts>;
    public connection: Connection;
    public settingClient: SettingClient;
    public userClient: UserClient;
    public warningClient: WarningClient;
    public secret: string;
    constructor(private options: EulaDbParams) {
        this.secret = options.secret;
        this.redisClient = createClient(options.redisClient);
        this.redisClient.connect()
        this.settingClient = new SettingClient(this);
        this.userClient = new UserClient(this);
        this.warningClient = new WarningClient(this);
    }

    public async connect() {
        await createConnection({...this.options.connectionConfig as any, entities: [
            User, Guild, Setting, Warning
        ]}).then(async connection => {
            this.connection = connection;
            console.log("Created connection");
        }).catch(error => console.log(error));
    }

    /**
     * this method ensures the existence of an guild in the database.
     * An entry will be created, if an guild does not exist and saved in redis so there are no more
     * requests
     */
    public async ensureGuild(guildId: string) {
        const guildData = await this.redisClient.get(`guild_${guildId}`);
        if(!guildData) {
            const guildRepo = this.connection.getRepository(Guild);
            let guild = await guildRepo.findOne(guildId);
            if(guild) {
                await this.redisClient.setNX(`guild_${guildId}`, JSON.stringify(guild));
                return
            }
            guild = new Guild();
            guild.id = guildId;
            guildRepo.save(guild);
        }
    }

    public async purge(guild: string) {
        const guildRepo = this.connection.getRepository(Guild);
        const userRepo = this.connection.getRepository(User);
        const warningRepo = this.connection.getRepository(Warning);
        await guildRepo.delete({ id: guild });
        await userRepo.delete({ guildId: guild });
        await warningRepo.delete({ guildId: guild });
    }

    public encryptUserId(guild: string, userId: string) {
        const cipher = crypto.createCipher("aes-256-cbc", Buffer.from(this.secret));
        const encrypted = Buffer.concat([cipher.update(Buffer.from(`${guild}_${userId}`)), cipher.final()]);
        return encrypted.toString("hex");
    }
}