import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Permissions } from "discord.js";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("urlfilter")
        .addBooleanOption((e) => e.setName("status").setDescription("The set status"))
        .setDescription("Users with 'Administrator' or 'Manage Message' are still allowed to post links."),
    action: (interaction: CommandInteraction, client: Client) => {
        const status = interaction.options.getBoolean("status");
        global.settings.data[interaction.guildId].urlFilter = status;
        global.settings.save();
        interaction.reply(`Url filter was set to \`${status}\``);
    },
    permissions: [ "ADMINISTRATOR" ],
    isDev: true,
}


