import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '.';
import { langManager } from '..';


export const command: Command = {
    data: new SlashCommandBuilder() 
        .addStringOption((e) =>
            e.setName("language")
            .setDescription("Set language")
            .addChoices(langManager.allLanguages.map(lang => [ lang.name, lang.short ]))
            .setRequired(true)
        )
        .setName('language')
        .setDescription('Set eulas server language'),
    action: async ({interaction, eulaDb, language}) => {
        const newLang = interaction.options.getString("language");
        await eulaDb.settingClient.setSetting(interaction.guildId, "language", newLang, "string");
        interaction.reply({
            ephemeral: true,
            content: langManager.getLanguage(newLang).get("lang_set"),
        })
    },
    permissions: [ "ADMINISTRATOR" ],
}


