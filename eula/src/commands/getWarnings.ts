import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { Warning } from 'eula_db/dist/entity/Warning';
import { DateTime } from 'luxon';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder() 
        .addUserOption((e) =>
            e.setName("user")
            .setDescription("Get warnings from this user")
            .setRequired(true),
        )
        .setName('get_warnings')
        .setDescription('Sets the warning threshold for your guild'),
    action: async ({interaction, eulaDb, log}) => {
        const warnings = await eulaDb.warningClient.getWarning(interaction.options.getUser("user").id, interaction.guildId)
        
        function map(warning: Warning): MessageEmbed {
            return new MessageEmbed()
            .setDescription(warning.reason)
        }
        
        interaction.reply({
            embeds: warnings.map(map)
        })
    },
    permissions: [ "KICK_MEMBERS" ],
}


