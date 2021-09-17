import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Warning } from 'eula_db/dist/entity/Warning';
import { Command } from '.';
import { buttonManager } from '../lib/Button';


export const command: Command = {
    data: new SlashCommandBuilder() 
        .addUserOption((e) =>
            e.setName("user")
            .setDescription("Get warnings from this user")
            .setRequired(true),
        )
        .setName('get_warnings')
        .setDescription('Sets the warning threshold for your guild'),
    action: async ({interaction, eulaDb, log, client}) => {
        const warnings = await eulaDb.warningClient.getWarning(interaction.options.getUser("user").id, interaction.guildId)
        
        function map(warning: Warning): MessageEmbed {
            return new MessageEmbed()
                .setDescription(warning.reason);
        }

        let page = 0;

        const row = new MessageActionRow()
            .addComponents(
                buttonManager.decorate(new MessageButton()
                    .setLabel("Prev")
                    .setStyle("PRIMARY")
                    .setCustomId(`${interaction.id}_prev`), () => console.log("prev")),
                buttonManager.decorate(new MessageButton()
                    .setLabel("Next")
                    .setCustomId(`${interaction.id}_next`)
                    .setStyle("PRIMARY"), () => console.log("next")),
            );
            
        interaction.reply({
            content: "Warnings",
            embeds: warnings.map(map),
            components: [ row ],
        });
    },
    permissions: [ "KICK_MEMBERS" ],
}


