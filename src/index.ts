require("dotenv").config();
const fs = require("fs");
import { Client, Intents } from "discord.js";

function createConnection() {
    const data = new Set(require("../localdb.json"));
    const client = new Client({
        intents: [ Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS ],
    });

    client.login(process.env.token);
    
    
    client.on("ready", () => {
        console.log("Bot started successfully");
        client.user.setActivity({
            type: "STREAMING",
            name: "Vengeance will be mine!"
        })
    })
    
    client.on("messageCreate", (message) => {
        if(message.member.permissions.has("ADMINISTRATOR")) {
            if(message.content.startsWith("--ignore")) {
                message.mentions.users.each(e => data.add(e.id));
                fs.writeFile("localdb.json",JSON.stringify(Array.from(data)), () => {})
            } else if (message.content.startsWith("--allow")) {
                message.mentions.users.each(e => data.delete(e.id));
                fs.writeFile("localdb.json",JSON.stringify(Array.from(data)), () => {})
            }
        }
        if(data.has(message.author.id)) message.delete();
    });
}

function bootstrap() {
    fs.exists("localdb.json", function(exists) {
        if(exists) {
            createConnection();
        } else {
            fs.writeFile("localdb.json","[]", () => {
                createConnection();
            })
        }
    });
}

bootstrap();
