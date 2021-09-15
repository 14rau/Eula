import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("urlfilter")
        .addBooleanOption((e) => e.setName("status").setDescription("The set status"))
        .setDescription("Users with 'Administrator' or 'Manage Message' are still allowed to post links."),
    action: async ({interaction, eulaDb, language}) => {
        const status = interaction.options.getBoolean("status");
        await eulaDb.settingClient.setSetting(interaction.guildId, "urlFilter", `${status}`, "bool");
        interaction.reply(language.get("urlFilter.reply", { status: `${status}` }));
    },
    permissions: [ "ADMINISTRATOR" ],
    isDev: true,
}


