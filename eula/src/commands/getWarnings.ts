import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import { EulaDb } from 'eula_db';
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
    action: async ({interaction, eulaDb}) => {
        eulaDb.warningClient.getWarning(interaction.options.getUser("user").id, interaction.guildId)
        .then(console.log);
        interaction.reply({
            content: "Not implemeted yet!",
            ephemeral: true,
        })
    },
    permissions: [ "KICK_MEMBERS" ],
}


