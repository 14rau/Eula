import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder() 
        .addChannelOption((e) =>
            e.setName("channel")
            .setDescription("Channel where the logs will be posted")
        )
        .setName('logchannel')
        .setDescription('Sets channel eula will writes logs to'),
    action: async ({interaction, eulaDb, language}) => {
        eulaDb.settingClient.setSetting(interaction.guildId, "logchannel", interaction.options.getChannel("channel")?.id, "string");
        interaction.reply({
            content: language.get("logchannel.reply"),
            ephemeral: true,
        })
    },
    permissions: [ "KICK_MEMBERS" ],
}


