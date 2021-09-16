import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';
import { Command } from '.';
import { EventWarning } from '../lib/LogRunner';


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
    action: async ({interaction, eulaDb, log, language}) => {
        const now = DateTime.now();
        const user = interaction.options.getUser("user");
        await eulaDb.ensureUser(user.id, interaction.guildId);
        const warning = await eulaDb.warningClient.createWarning(
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
            .setTitle(language.get("warn.title"))
            .setDescription(`${language.get("warn.description", { user1: `<@${user.id}>`, username1: `**${user.username}**`, user2: `<@${interaction.user.id}>`, username2: `**${interaction.user.username}**`, reason: warning.warning.reason })}
            \n${warning.warning.validTill ? language.get("warn.warningWithTs", { timestamp: `<t:${Math.floor(DateTime.fromISO(warning.warning.validTill).toSeconds())}:f>` }) : language.get("warn.warningPermanent")}\n
            ${language.get("warn.amountWarnings", { amount: `${warning.warnings?.length ?? 0}` })}
            `);

            log.run(<EventWarning>{
                amountWarnings: warning.warnings?.length ?? 0,
                userThatWarned: interaction.user,
                warnedUser: user,
                warning: warning.warning,
            }, "warningGenerated", interaction.guildId);

        if(interaction.options.getBoolean("notification")) {
            user.send({
                embeds: [
                    new MessageEmbed()
                        .setTimestamp(now.toJSDate())
                        .setTitle(language.get("warn.title"))
                        .setDescription(`${language.get("warn.description", { user1: `<@${user.id}>`, username1: `**${user.username}**`, user2: `<@${interaction.user.id}>`, username2: `**${interaction.user.username}**`, reason: warning.warning.reason })}
                        \n${warning.warning.validTill ? language.get("warn.warningWithTs", { timestamp: `<t:${Math.floor(DateTime.fromISO(warning.warning.validTill).toSeconds())}:f>` }) : language.get("warn.warningPermanent")}\n
                       `)
                ]
            })
        }

        const threshold: number = await eulaDb.settingClient.getSetting(interaction.guildId, "warningthreshold") as number;
        interaction.reply({ content: language.get("warn.reply"), embeds: [ warningEmbed ], ephemeral: true });
        if(threshold && warning.warnings.length >= threshold) {
            interaction.followUp({ content: language.get("warn.treshholdWarning"), ephemeral: true});
        }
    },
    permissions: [ "KICK_MEMBERS" ],
}


