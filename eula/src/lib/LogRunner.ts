import { Client, ClientEvents, GuildMember, Message, MessageEmbed, User } from "discord.js";
import { EulaDb, Warning } from "eula_db";
import { DateTime } from "luxon";
import { Language, LanguageManager } from "./lang/Language";
import { LogClient } from "./LogClient";

export interface EventWarning {
    warning: Warning,
    warnedUser: User;
    userThatWarned: User;
    amountWarnings: number;
}

export interface EulaEvents {
    warningGenerated: EventWarning;
}

type LogType = keyof ClientEvents | keyof EulaEvents;

export class LogManager {
    private runner = new Map<string, LogRunner>();

    constructor(private db: EulaDb, client: Client, private langManager: LanguageManager, private logClient: LogClient) {
    }

    public registerRunner(guild: string) {
        this.runner.set(guild, new LogRunner(guild, this.db, this.langManager));
    }

    public run(event: any, logType: LogType, guildId: string) {
        if(!guildId) return;
        this.runner.get(guildId).log(event, logType, this.logClient.log(guildId));
    }

    public getRunner(guildId: string) {
        return this.runner.get(guildId);
    }

    public refreshRunner(guild: string) {
        this.runner.get(guild).reload();
    }
}

export class LogRunner {
    private status: boolean;
    private logTypes: LogType[];
    private language: Language;

    constructor(private guild: string, private db: EulaDb, private langManager: LanguageManager) {
        this.reload();
    }

    /** load settings for runner */
    public async reload() {
        console.log(`[LogRunner]: reload ${this.guild}`);
        this.logTypes = [];
        this.status = await this.db.settingClient.getSetting(this.guild, "log.enable") as any;
        if(!this.status) return;

        if(await this.db.settingClient.getSetting(this.guild, "log.join") as any) this.logTypes.push("guildMemberAdd");
        if(await this.db.settingClient.getSetting(this.guild, "log.delete_message") as any) this.logTypes.push("messageDelete");
        if(await this.db.settingClient.getSetting(this.guild, "log.warning") as any) this.logTypes.push("warningGenerated");
        if(await this.db.settingClient.getSetting(this.guild, "log.leave") as any) this.logTypes.push("guildMemberRemove");

        this.language = this.langManager.getLanguage((await this.db.settingClient.getSetting(this.guild, "language") as any) ?? process.env.defaultLanguage ?? "en");
    }

    public async log(event: any, logType: LogType, logger) {
        if(!this.status) return;
        if(!this.logTypes.includes(logType)) return;
        switch(logType) {
            case "messageDelete": {
                logger({embeds: [this.messageDelete(event)]});
                return;
            }
            case "warningGenerated": {
                logger({embeds: [this.warningGenerated(event)]});
                return;
            }
            case "guildMemberAdd": {
                logger({embeds: [this.guildMemberAdd(event)]});
                return;
            }
            case "guildMemberRemove": {
                logger({embeds: [this.guildMemberRemove(event)]});
                return;
            }
        }
       
    }

    public guildMemberAdd(member: GuildMember): MessageEmbed {
        return new MessageEmbed()
            .setTimestamp(new Date())
            .addField(this.language.get("logger.guildMemberAdd.field_title"), this.language.get("logger.guildMemberAdd.field_value", { tag: `<@${member.id}>`, name: member.user.username }))
            .setAuthor(member.user.username, member.user.displayAvatarURL());
    }

    public guildMemberRemove(member: GuildMember): MessageEmbed {
        return new MessageEmbed()
            .setTimestamp(new Date())
            .addField(this.language.get("logger.guildMemberRemove.field_title"), this.language.get("logger.guildMemberRemove.field_value", { tag: `<@${member.id}>`, name: member.user.username }))
            .setAuthor(member.user.username, member.user.displayAvatarURL());
    }

    public warningGenerated(ev: EventWarning) {
        return new MessageEmbed()
            .setTimestamp(DateTime.now().toJSDate())
            .setTitle(this.language.get("warn.title"))
            .setDescription(`${this.language.get("warn.description", { user1: `<@${ev.warnedUser.id}>`, username1: `**${ev.warnedUser.username}**`, user2: `<@${ev.userThatWarned.id}>`, username2: `**${ev.userThatWarned.username}**`, reason: ev.warning.reason })}
            \n${ev.warning.validTill ? this.language.get("warn.warningWithTs", { timestamp: `<t:${Math.floor(DateTime.fromISO(ev.warning.validTill).toSeconds())}:f>` }) : this.language.get("warn.warningPermanent")}\n
            ${this.language.get("warn.amountWarnings", { amount: `${ev.amountWarnings}` })}
            `);
    }

    public messageDelete(message: Message | Partial<Message>): MessageEmbed {
        return new MessageEmbed()
            .setTimestamp(new Date())
            .addField(this.language.get("logger.messageDeleted.field_title"), this.language.get("logger.messageDeleted.field_value"))
            .setDescription(message.content)
            .setAuthor(message.author.username, message.author.displayAvatarURL());
    }


}