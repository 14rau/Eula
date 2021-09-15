import { Embed } from "@discordjs/builders";
import { Client, GuildMember } from "discord.js";
import { EulaDb } from "eula_db";
import { LogClient } from "./LogClient";

export class LogManager {
    private runner = new Map<string, LogRunner>();
    public logClient: LogClient;
    private logTypes: string[];

    constructor(private db: EulaDb, client: Client) {
    }

    public registerRunner(guild: string) {
        this.runner.set(guild, new LogRunner(guild, this.db));
    }

    public run(event: any, logType: string) {
        if(!event.guild.id) return;
        this.runner.get(event.guild.id).log(event, logType, this.logClient.log(event.guild.id));
    }

    public refreshRunner(guild: string) {
        this.runner.get(guild).reload();
    }
}

export class LogRunner {
    private status: boolean;

    constructor(private guild: string, private db: EulaDb) {
        this.reload();
    }

    /** load settings for runner */
    public async reload() {
        console.log(`[LogRunner]: reload ${this.guild}`);
        this.status = await this.db.settingClient.getSetting(this.guild, "log_status") as any;
    }

    public async log(event: any, logType: string, logger) {
       
    }

    private join(member: GuildMember): Embed {
        return new Embed()
            .setTimestamp(new Date())
            .setAuthor({
                name: member.user.username,
                iconURL: member.user.avatar
            })
            .addField({
                name: "{JOINED}",
                value: "{}",
            })
    }


}