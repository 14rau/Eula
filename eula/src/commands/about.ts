import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Command } from ".";
import { Duration } from "luxon";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Show some informations about eula"),
        action: ({ interaction, client, language }) => {
            const exampleEmbed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Eula - about")
                .setDescription(language.get("about.description"))
                .addField(language.get("about.uptime"), `${Duration.fromMillis(client.uptime).toFormat("hh:mm")}`)
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel(language.get("about.invite"))
                            .setStyle("LINK")
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=139586825366&scope=bot%20applications.commands`),
                        new MessageButton()
                            .setLabel(language.get("about.support"))
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


