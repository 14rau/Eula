import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('allow')
        .addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true))
        .setDescription('allow a user to write again'),
    action: async ({interaction, eulaDb, language }) => {
        const member = interaction.options.getUser("target");
        eulaDb.userClient.pardonUser(interaction.guildId, member.id);
        interaction.reply(language.get("allow.reply", { username: member.username }));
    },
    permissions: [ "ADMINISTRATOR" ],
}


