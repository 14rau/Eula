import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('purges all data from a guild. Eula will leave your server once you use this command!'),
    action: async ({interaction, language, eulaDb}) => {
        await eulaDb.purge(interaction.guildId);
        await interaction.reply({ content: language.get("purge.reply"), ephemeral: true });
        interaction.guild.leave();
    },
    permissions: [ "ADMINISTRATOR" ],
}


