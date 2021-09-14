import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder() 
        .addIntegerOption((e) =>
            e.setName("threshold")
            .setDescription("Number of warnings, where you will be asked to take an action")
        )
        .setName('warningthreshold')
        .setDescription('Sets the warning threshold for your guild'),
    action: async ({interaction, eulaDb, language}) => {
        eulaDb.settingClient.setSetting(interaction.guildId, "warningthreshold", interaction.options.getInteger("threshold")?.toString(), "int");
        interaction.reply({
            content: language.get("warningthreshold.reply"),
            ephemeral: true,
        })
    },
    permissions: [ "KICK_MEMBERS" ],
}


