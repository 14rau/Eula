import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import { EulaDb } from 'eula_db';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ignore')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .setDescription('Will ignore an user!'),
    action: async (interaction: CommandInteraction, client: Client, eulaDb) => {
        const member = interaction.options.getUser('target');
        await eulaDb.userClient.blockUser(interaction.guildId, member.id);
        
        interaction.reply(`${member.username}, Vengeance will be mine!`);
    },
    permissions: [ "ADMINISTRATOR" ],
}


