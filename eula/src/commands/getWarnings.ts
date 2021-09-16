import { SlashCommandBuilder } from '@discordjs/builders';
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
    },
    permissions: [ "KICK_MEMBERS" ],
}


