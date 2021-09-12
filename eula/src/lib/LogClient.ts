import { Client, MessageOptions, MessagePayload } from "discord.js";
import { EulaDb } from "eula_db";

export class LogClient {
    constructor(private eulaDb: EulaDb, private client: Client) {

    }

    public log(guild: string) {
        return async (options: string | MessagePayload | MessageOptions) => {
            const channel: string = await this.eulaDb.settingClient.getSetting(guild, "logchannel") as string;
            this.client.channels.fetch(channel).then(e => {
                if(e.isText()) {
                    e.send(options);
                }
            })
        }
    }
}