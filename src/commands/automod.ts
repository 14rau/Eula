import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Permissions } from "discord.js";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("automod")
        .addBooleanOption((e) => e.setName("status").setDescription("The given Status"))
        .addIntegerOption((e) => e.setName("take_action_after").setDescription("Take action after"))
        .addStringOption((e) => e.setName("taken_action").setDescription("The taken action")
            .addChoices([["Kick", "KICK"], ["Ban", "BANN"]])
        )
        .addIntegerOption((e) => e.setName("remember_for_x_minutes").setDescription("How many minutes Eula will remember the action"))
        .setDescription("Enables/Disables the automod and set accordingly the settings"),
    action: (interaction: CommandInteraction, client: Client) => {
        const status = interaction.options.getBoolean("status");
        global.settings.data[interaction.guildId].automod["active"] = status;
        global.settings.save();
        interaction.reply(`Url filter was set to \`${status}\``);
    },
    permissions: [ "ADMINISTRATOR" ],
    isDev: true,
}


