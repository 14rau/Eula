import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { EulaDb } from "eula_db";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('allow')
        .addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true))
        .setDescription('allow a user to write again'),
    action: async (interaction: CommandInteraction, client: Client, eulaDb) => {
        const member = interaction.options.getUser("target");
        eulaDb.userClient.pardonUser(interaction.guildId, member.id);
        interaction.reply(`Vengeance... was enough for ${member.username}`)
    },
    permissions: [ "ADMINISTRATOR" ],
}


