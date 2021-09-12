import { Message } from "discord.js";
import { EulaDb } from "eula_db";
import Cache from "node-cache";

export class AutoModManager {
    private runner = new Map<string, AutoModRunner>();

    constructor(private db: EulaDb) {

    }

    public registerRunner(guild: string) {
        this.runner.set(guild, new AutoModRunner(guild, this.db));
    }

    public run(message: Message) {
        if(!message.guildId) return;
        this.runner.get(message.guildId).run(message)
    }

    public refreshRunner(guild: string) {
        this.runner.get(guild).reload();
    }
}

export class AutoModRunner {
    private status: boolean;
    private urlFilter: boolean;
    private taken_action: "BAN" | "KICK" | "MUTE";
    private take_action_after: number;
    private remember_for_x_minutes: number;
    private cache = new Cache();
    private lastMessageCache = new Cache();
    constructor(private guild: string, private db: EulaDb) {
        this.reload();
    }

    /** load settings for runner */
    public async reload() {
        console.log(`[AutoModRunner]: reload ${this.guild}`);
        this.status = await this.db.settingClient.getSetting(this.guild, "status") as any;
        this.taken_action = await this.db.settingClient.getSetting(this.guild, "taken_action") as any;
        this.take_action_after = await this.db.settingClient.getSetting(this.guild, "take_action_after") as any;
        this.remember_for_x_minutes = await this.db.settingClient.getSetting(this.guild, "remember_for_x_minutes") as any;

        this.urlFilter = await this.db.settingClient.getSetting(this.guild, "urlFilter") as any;
    }

    public async run(message: Message) {
        if(this.status && this.take_action_after && this.remember_for_x_minutes && this.taken_action) {
            let addWarning = false;
            if(this.urlFilter) {
                if (message.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
                    if (!(message.member.permissions.has("ADMINISTRATOR") || message.member.permissions.has("MANAGE_MESSAGES"))) {
                        if (message.content.startsWith("https://tenor.com/view/")) return;
                        await message.delete();
                        message.channel.send("Das Posten von Links ist untersagt.");
                        addWarning = true;
                    }
                }
            }

            if(addWarning) {
                if(this.cache.has(message.author.id)) {
                    this.cache.set(message.author.id, this.cache.get<number>(message.author.id) + 1, this.remember_for_x_minutes*60)
                } else {
                    this.cache.set(message.author.id, 1, this.remember_for_x_minutes*60);
                }
            }

            if(this.cache.get(message.author.id) >= this.take_action_after) {
                message.channel.send(`Take Action: ${this.taken_action}`);
            }
        }
    }
}