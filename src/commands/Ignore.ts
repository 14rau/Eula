import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ignore')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .setDescription('Will ignore an user!'),
    action: (interaction: CommandInteraction, client: Client) => {
        const member = interaction.options.getUser('target');
        global.settings.data[interaction.guildId].ignoredUsers = Array.from(new Set(global.settings.data[interaction.guildId].ignoredUsers).add(member.id));
        global.settings.save();
        interaction.reply(`${member.username}, Vengeance will be mine!`);
    },
    permissions: [ "ADMINISTRATOR" ],
}


