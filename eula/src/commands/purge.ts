import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import { EulaDb } from 'eula_db';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('purges all data from a guild. Eula will leave your server once you use this command!'),
    action: async (interaction: CommandInteraction, client: Client, eulaDb) => {
        await eulaDb.purge(interaction.guildId);
        await interaction.reply({ content: "Your guild has been purged from all data.", ephemeral: true });
        interaction.guild.leave();
    },
    permissions: [ "ADMINISTRATOR" ],
}


