import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('support')
        .addUserOption(option => option.setName('description').setDescription('Description of the issue').setRequired(true))
        .setDescription('Send a support request'),
    action: async ({interaction, eulaDb, language }) => {
        
    },
    permissions: [],
}


