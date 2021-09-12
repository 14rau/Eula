require("dotenv").config();
const fs = require("fs");
import { Client, Intents, Permissions } from "discord.js";
import { EulaDb } from "eula_db";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Command } from "./commands";
import { LogClient } from "./lib/LogClient";
import { AutoModManager } from "./lib/AutoModRunner";

const rest = new REST({ version: '9' }).setToken(process.env.token);

export type ActionType = "BAN" | "KICK";




async function bootstrap() {
    const eulaDb = new EulaDb({
        connectionConfig: {
            type: "mysql",
            password: process.env.MYSQL_PASSWORD,
            username: process.env.MYSQL_USER,
            database: process.env.MYSQL_DATABASE,
            synchronize: true,
            logger: "advanced-console",
        },
        redisClient: {
            socket: {
                
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

    const commandFiles = fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js') && !file.includes("index"));
    const functions = new Map<string, Command>();
    const commands = [];
    const developerCommands = [];
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        const cmd = command.command.data.toJSON()
        if(!process.argv.includes("--devMode") && cmd.devMode) continue;
        commands.push(cmd);
        functions.set(cmd.name, command.command);
    }

    await client.login(process.env.token);


    
    
    
    client.once("ready", async () => {
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

    const autoMod = new AutoModManager(eulaDb);

    client.guilds.cache.forEach(e => autoMod.registerRunner(e.id))
    
    client.on("messageCreate", async (message) => {
        eulaDb.userClient.isUserBlocked(message.guild.id, message.author.id).then(e => {
            if(e) message.delete();
        });
        autoMod.run(message);
    });

    client.on("interactionCreate", async (er) => {
        if(er.isCommand() && er.guildId) {
            try {
                const cmd = functions.get(er.commandName);
                const perm: Readonly<Permissions> = er.member?.permissions as Readonly<Permissions>;
                if(!cmd.permissions || cmd.permissions?.every(e => perm.has(e))) {
                   cmd.action?.(er, client, eulaDb, logClient.log(er.guildId), autoMod);
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
        } else if (!er.guildId && er.isCommand()) {
            er.reply({
                content: "[ERR] Can't help you, sorry (DM Commands disabled)",
                ephemeral: true,
            });
        }
    });
}

bootstrap();
