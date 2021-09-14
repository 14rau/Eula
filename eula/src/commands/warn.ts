import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';
import { Command } from '.';


export const command: Command = {
    data: new SlashCommandBuilder() 
        .addUserOption((e) => 
            e.setName("user")
            .setDescription("User that will get the warning")
            .setRequired(true)
        )
        .addStringOption(e =>
            e.setName("description")
            .setDescription("The description of the warning")
            .setRequired(true)
        )
        .addIntegerOption((e) => 
            e.setName("valid_till")
            .setDescription("Amount of days the warning will be valid")
        )
        .addBooleanOption(e => 
            e.setName("notification")
            .setDescription("Set this to true, in case that you want to send a notification to the warned user")
        )
        .setName('warn')
        .setDescription('Warns a user'),
    action: async (interaction: CommandInteraction, client: Client, db, log) => {
        const now = DateTime.now();
        const user = interaction.options.getUser("user");
        await db.ensureUser(user.id, interaction.guildId);
        const warning = await db.warningClient.createWarning(
            user.id,
            interaction.guildId,
            {
                reason: interaction.options.getString("description"),
                isGenerated: false,
                validTill: interaction.options.getInteger("valid_till") ? now.plus({ days: interaction.options.getInteger("valid_till") }).toISO() : null,
            }
        );
        const warningEmbed = new MessageEmbed()
            .setTimestamp(now.toJSDate())
            .setTitle("Added Warning")
            .setDescription(`<@${user.id}> (**${user.username}**) has been warned by <@${interaction.user.id}> (${interaction.user.username})\nReason:\n${warning.warning.reason}
            \n${warning.warning.validTill ? `Warning is valid till <t:${Math.floor(DateTime.fromISO(warning.warning.validTill).toSeconds())}:f>` : "Warning is added permanently (Delete with /removeWarning)"}
            Amount of warnings: ${warning.warnings?.length ?? 0}`);
            log({
            embeds: [
                warningEmbed
            ]
        });
        if(interaction.options.getBoolean("notification")) {
            user.send({
                embeds: [
                    new MessageEmbed()
                        .setTimestamp(now.toJSDate())
                        .setTitle("Added Warning")
                        .setDescription(`<@${user.id}> (**${user.username}**) has been warned by <@${interaction.user.id}> (${interaction.user.username})\nReason:\n${warning.warning.reason}
                        \n${warning.warning.validTill ? `Warning is valid till <t:${Math.floor(DateTime.fromISO(warning.warning.validTill).toSeconds())}:f>` : "Warning is added permanently"}`)
                ]
            })
        }

        const threshold: number = await db.settingClient.getSetting(interaction.guildId, "warningthreshold") as number;
        interaction.reply({ content: "Warning has been generated", embeds: [ warningEmbed ], ephemeral: true });
        if(threshold && warning.warnings.length >= threshold) {
            interaction.followUp({ content: "[Warning]: Threshold of warning has been reached for this user. You may want to take action.", ephemeral: true});
        }
    },
    permissions: [ "KICK_MEMBERS" ],
}


