require("dotenv").config();
const fs = require("fs");
import { Client, CommandInteraction, Intents, Permissions } from "discord.js";
import { DataLoader } from "./lib/DataLoader";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Command } from "./commands";

const rest = new REST({ version: '9' }).setToken(process.env.token);

export type ActionType = "BAN" | "KICK";

interface ServerSettings {
    ignoredUsers: string[];
    urlFilter: boolean;
    automod: {
        active: boolean;
        actionAfter: number,
        actionInterval: number,
        action: ActionType
    }
}

async function ensureGuildSettings(guildId: string, dataLoader: DataLoader<Record<string, ServerSettings>>) {
    if(!dataLoader.data[guildId]) {
        dataLoader.data[guildId] = {
            ignoredUsers: [],
            urlFilter: false,
            automod: {
                active: false,
                actionAfter: 3,
                action: "KICK",
                actionInterval: 10000,
            }
        }
        await dataLoader.save();
    }
}

async function automig(dataLoader: DataLoader<Record<string, ServerSettings>>) {
    console.log(dataLoader.data)
    for(const key in dataLoader.data) {
        if(!(dataLoader.data[key]["automod"])) {
            dataLoader.data[key]["automod"] = {
                active: false,
                actionAfter: 3,
                action: "KICK",
                actionInterval: 10000,
            }
        }
    }
    dataLoader.save();
}


async function bootstrap() {
    const settings = new DataLoader<Record<string, ServerSettings>>("localdb.json", {});

    await settings.init();
    settings.loadFrom("../../localdb.json");
    setTimeout(async () => {
        // await automig(settings);
    }, 500)

    const client = new Client({
        intents: [ Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS ],
    });

    const commandFiles = fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js') && !file.includes("index"));
    const functions = new Map<string, Command>();
    const commands = [];
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        const cmd = command.command.data.toJSON()
        if(!process.argv.includes("--devMode") && cmd.devMode) continue;
        commands.push(cmd);
        functions.set(cmd.name, command.command);
    }

    await client.login(process.env.token);

    global.settings = settings;
    
    
    
    client.on("ready", async () => {
        console.log("Bot started successfully");
        client.user.setActivity({
            type: "STREAMING",
            name: "Vengeance will be mine!"
        });


        if(!process.argv.includes("--devMode")) {
            try {
                console.log('Started refreshing application (/) commands.');
        
                await rest.put(
                    Routes.applicationCommands(client.application.id),
                    { body: commands },
                );
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                console.log('Started refreshing application (/) commands.');
                const serverCmdIndex = process.argv.indexOf("-s");
                const server = process.argv[serverCmdIndex !== -1 ? serverCmdIndex+1 : -1];
                await rest.put(
                    Routes.applicationGuildCommands(client.application.id, server ?? "758384067934158858"),
                    { body: commands },
                );
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        } 
    });
    
    client.on("messageCreate", async (message) => {
        if(settings.data[message.guild.id]?.ignoredUsers.includes(message.author.id)) message.delete();

        if(settings.data[message.guild.id]?.urlFilter) {
            if (message.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
                if (!(message.member.permissions.has("ADMINISTRATOR") || message.member.permissions.has("MANAGE_MESSAGES"))) {
                    if (message.content.startsWith("https://tenor.com/view/")) return;
                    await message.delete();
                    message.channel.send("Das Posten von Links ist untersagt.");
                }
            }
        }
    });

    client.on("interactionCreate", async (er) => {
        if(er.isCommand()) {
            try {
                await ensureGuildSettings(er.guildId, settings)
                const cmd = functions.get(er.commandName);
                const perm: Readonly<Permissions> = er.member?.permissions as Readonly<Permissions>;
                if(!cmd.permissions || cmd.permissions?.every(e => perm.has(e))) {
                   cmd.action?.(er, client);
                } else {
                    er.reply({
                        content: "...Schlecht [MISSING PERM]",
                        ephemeral: true,
                    })
                }
            } catch (err) {
                er.reply({
                    content: "[ERR] I will have my vengeance... someday",
                    ephemeral: true,
                });
                console.log(err);
            }
        }
    });
}

bootstrap();
