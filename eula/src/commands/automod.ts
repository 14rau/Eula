import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("automod")
        .addBooleanOption((e) => e.setName("status").setDescription("The given Status"))
        .addIntegerOption((e) => e.setName("take_action_after").setDescription("Take action after"))
        .addStringOption((e) => e.setName("taken_action").setDescription("The taken action")
            .addChoices([["Kick", "KICK"], ["Ban", "BANN"], ["Mute", "MUTE"]])
        )
        .addIntegerOption((e) => e.setName("remember_for_x_minutes").setDescription("How many minutes Eula will remember the action"))
        .setDescription("Enables/Disables the automod and set accordingly the settings"),
    action: ({interaction, eulaDb, autoMod, language}) => {
        if(interaction.options.getBoolean("status") != null)
            eulaDb.settingClient.setSetting(
                interaction.guildId,
                "status",
                `${interaction.options.getBoolean("status")}`,
                "bool"
            );
        if(interaction.options.getString("taken_action") != null)
            eulaDb.settingClient.setSetting(
                interaction.guildId,
                "taken_action",
                `${interaction.options.getString("taken_action")}`,
                "string"
            );
        if(interaction.options.getInteger("take_action_after") != null)
            eulaDb.settingClient.setSetting(
                interaction.guildId,
                "take_action_after",
                `${interaction.options.getInteger("take_action_after")}`,
                "string"
            );
        if(interaction.options.getInteger("remember_for_x_minutes") != null)
            eulaDb.settingClient.setSetting(
                interaction.guildId,
                "remember_for_x_minutes",
                `${interaction.options.getInteger("remember_for_x_minutes")}`,
                "string"
            );
        autoMod.refreshRunner(interaction.guildId);
        interaction.reply({ ephemeral: true, content: language.get("automod.reply") });

    },
    permissions: [ "ADMINISTRATOR" ],
    isDev: true,
}


