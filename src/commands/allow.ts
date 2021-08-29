import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Permissions } from "discord.js";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('allow')
        .addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true))
        .setDescription('allow a user to write again'),
    action: (interaction: CommandInteraction, client: Client) => {
        const member = interaction.options.getUser("target");
        const data = new Set(global.settings.data[interaction.guildId].ignoredUsers)
        data.delete(member.id);
        global.settings.data[interaction.guildId].ignoredUsers = Array.from(data);
        global.settings.save();
        interaction.reply(`Vengeance... was enough for ${member.username}`)
    },
    permissions: [ "ADMINISTRATOR" ],
}


