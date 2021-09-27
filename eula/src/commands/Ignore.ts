import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ignore')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .setDescription('Will ignore an user!'),
    action: async ({interaction, eulaDb, language}) => {
        const member = interaction.options.getUser('target');
        await eulaDb.userClient.blockUser(interaction.guildId, member.id);
        
        interaction.reply(language.get("ignore.reply", { username: member.username }));
    },
    permissions: [ "ADMINISTRATOR" ],
}


