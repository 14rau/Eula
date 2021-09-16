require("dotenv").config();
const fs = require("fs");
import { Client, Intents, Permissions } from "discord.js";
import { EulaDb } from "eula_db";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Command } from "./commands";
import { LogClient } from "./lib/LogClient";
import { AutoModManager } from "./lib/AutoModRunner";
import { LanguageManager } from "./lib/lang/Language";
import { LogManager } from "./lib/LogRunner";

export const langManager = new LanguageManager();

const rest = new REST({ version: '9' }).setToken(process.env.token);

export type ActionType = "BAN" | "KICK";




async function bootstrap() {
    const eulaDb = new EulaDb({
        connectionConfig: {
            type: "mysql",
            password: process.env.MYSQL_PASSWORD,
            username: process.env.MYSQL_USER,
            database: process.env.MYSQL_DATABASE,
            port: Number.parseInt(process.env.MYSQL_PORT),
            synchronize: true,
            logger: "advanced-console",
            host: process.env.DB_HOST,
        },
        redisClient: {
            socket: {
                host: process.env.REDIS_HOST,
            }
        },
        secret: process.env.secret
        
    });
    await eulaDb.connect();
    

    setTimeout(async () => {
        // await automig(settings);
    }, 500)

    const client = new Client({
        intents: [ Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS ],
    });

    const logClient = new LogClient(eulaDb, client);
    const commandFiles = fs.readdirSync(process.env.DOCKER_ENV === "DOCKER" ? './eula/dist/commands' : './dist/commands').filter(file => file.endsWith('.js') && !file.includes("index"));
    const functions = new Map<string, Command>();
    const commands = [];
    const developerCommands = [];
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        try {
            const cmd = command.command.data.toJSON()
            console.log(cmd)
            if(!process.argv.includes("--devMode") && cmd.devMode) continue;
            functions.set(cmd.name, command.command);
            commands.push(cmd);
        } catch (err) {
            console.error(err)
            console.error(file)
        }
    }

    await client.login(process.env.token);


    
    
    
    client.once("ready", async () => {
        console.log("Bot started successfully");
        client.user.setActivity({
            type: "STREAMING",
            name: "Vengeance will be mine!"
        });


        if(!process.argv.includes("--devMode")) {
            console.log("PRODUCTION-MODE")
            console.log(commands)
            try {
                console.log('Started refreshing application (/) commands.');
        
                const response = await rest.put(
                    Routes.applicationCommands(client.application.id),
                    { body: commands },
                );
                console.log(response)
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("DEV-MODE")
            console.log(commands)
            try {
                console.log('Started refreshing application (/) commands.');
                const serverCmdIndex = process.argv.indexOf("-s");
                const server = process.argv[serverCmdIndex !== -1 ? serverCmdIndex+1 : -1];
                const response = await rest.put(
                    Routes.applicationGuildCommands(client.application.id, server ?? "758384067934158858"),
                    { body: commands },
                );

                console.log(response)
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        } 
    });

    const autoMod = new AutoModManager(eulaDb);
    const autoLogger = new LogManager(eulaDb, client, langManager, logClient);
    

    client.guilds.cache.forEach(e => {
        autoMod.registerRunner(e.id);
        autoLogger.registerRunner(e.id);
    })
    
    client.on("messageCreate", async (message) => {
        eulaDb.userClient.isUserBlocked(message.guild.id, message.author.id).then(e => {
            if(e) message.delete();
        });
        autoMod.run(message);
    });

    client.on("guildCreate", async guild => {
        autoMod.refreshRunner(guild.id);
        autoLogger.registerRunner(guild.id);
        if(process.env.masterGuild) {
            const log = logClient.log(process.env.masterGuild);
            log(`Bot has joined guild: ${guild.id} (${guild.name})`);
        }
    });

    client.on("messageDelete", async (message) => {
        autoLogger.run(message, "messageDelete", message.guildId);
    });

    client.on("interactionCreate", async (er) => {
        if(er.isCommand() && er.guildId) {
            try {
                const cmd = functions.get(er.commandName);
                const perm: Readonly<Permissions> = er.member?.permissions as Readonly<Permissions>;
                if(!cmd.permissions || cmd.permissions?.every(e => perm.has(e))) {
                    const lang: string = await eulaDb.settingClient.getSetting(er.guildId, "language") as string;
                   cmd.action?.({interaction: er , client, eulaDb, log: autoLogger, autoMod, language: langManager.getLanguage(lang ?? process.env.defaultLanguage ?? "en")});
                } else {
                    er.reply({
                        content: "...Schlecht [MISSING PERM]",
                        ephemeral: true,
                    })
                }
            } catch (err) {
                console.log(err);
                er.channel.send({
                    content: "[ERR] I will have my vengeance... someday?"
                });
            }
        } else if (!er.guildId && er.isCommand()) {
            er.reply({
                content: "[ERR] Can't help you, sorry (DM Commands disabled)",
                ephemeral: true,
            });
        }
    });
}

bootstrap();
