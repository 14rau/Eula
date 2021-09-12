import { EulaDb } from "../..";
import { Setting, SettingType } from "../../entity/Settings";

export class SettingClient {
    constructor(private eulaDb: EulaDb) {

    }

    public async getSetting(guild: string, key: string) {
        await this.eulaDb.ensureGuild(guild);
        let redisResponse = await this.eulaDb.redisClient.get(`setting_${guild}_${key}`);
        let setting: Setting; 
        if(redisResponse) {
            setting = JSON.parse(redisResponse);
        } else {
            const settingRepo = this.eulaDb.connection.getRepository(Setting);
            setting = await settingRepo.findOne({
                where: {
                    guildId: guild,
                    key,
                }
            });
            if(!setting) return null;
            await this.eulaDb.redisClient.setEx(`setting_${guild}_${key}`, 60*60*24*30, JSON.stringify(setting));
        }
        return this.parseSetting(setting);
    }

    public async setSetting(guild: string, key: string, value: string, type: SettingType): Promise<Setting> {
        await this.eulaDb.ensureGuild(guild);
        this.eulaDb.redisClient.del(`setting_${guild}_${key}`);
        const settingRepo = this.eulaDb.connection.getRepository(Setting);
        let setting = await settingRepo.findOne({
            where: {
                guildId: guild,
                key,
            }
        });
        if(!setting) {
            setting = new Setting();
            setting.guildId = guild;
            setting.key = key;
            setting.type = type;
        }
       this.requireCorrectType(value, setting.type);
       setting.value = value;
       setting = await settingRepo.save(setting, { reload: true });
       this.eulaDb.redisClient.setEx(`setting_${guild}_${key}`, 60*60*24*30, JSON.stringify(setting));
       return setting;
    }


    private requireCorrectType(value: string, type: SettingType) {
        if(!this.validateType(value, type)) throw new Error("TYPE_DOES_NOT_MATCH")
    }

    private validateType(value: string, type: SettingType) {
        switch(type) {
            case "bool": return ["true", "false"].includes(value);
            case "float":
            case "int": return !Number.isNaN(Number.parseInt(value));
            case "string": return typeof value === "string";
        }
    }

    private parseSetting(setting: Setting) {
        switch(setting.type) {
            case "bool": return setting.value === "true";
            case "float": return Number.parseFloat(setting.value);
            case "int": return Number.parseInt(setting.value);
            case "string": return setting.value;
        }
    }
}