import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, Permissions } from "discord.js";
import { Command } from ".";
import { Duration } from "luxon";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Show some informations about eula"),
        action: (interaction: CommandInteraction, client: Client) => {
            const exampleEmbed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Eula - about")
                .setDescription("Eula is a simple message deletion bot. You can filter for specific words, regex or generally disable URL postings. In case you just want the message from someone be deleted, i can also make Eula do this!")
                .addField("Uptime", `${Duration.fromMillis(client.uptime).toFormat("hh:mm")}`)
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("Invite")
                            .setStyle("LINK")
                            .setURL("https://discord.com/api/oauth2/authorize?client_id=880880243873832990&permissions=2147493888&scope=bot"),
                        new MessageButton()
                            .setLabel("Support")
                            .setStyle("LINK")
                            .setURL("https://discord.gg/Zmtr88WBBx"),
                    );

        interaction.reply({
             embeds: [ exampleEmbed ],
             components: [ row ],
             ephemeral: true,
        });
    },
    permissions: [ "ADMINISTRATOR" ],
}


