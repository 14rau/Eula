import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Warning } from 'eula_db/dist/entity/Warning';
import { DateTime } from 'luxon';
import { Command } from '.';
import { buttonManager } from '../lib/Button';

export const command: Command = {
    data: new SlashCommandBuilder() 
        .addUserOption((e) =>
            e.setName("user")
            .setDescription("Get warnings from this user")
            .setRequired(true),
        )
        .setName('get_warnings')
        .setDescription('Sets the warning threshold for your guild'),
    action: async ({interaction, eulaDb, language }) => {
        const warnings = await eulaDb.warningClient.getWarning(interaction.options.getUser("user").id, interaction.guildId)
        
        function map(warning: Warning, index: number): MessageEmbed {
            const embed = new MessageEmbed()
                .addField(language.get("getWarnings.title.reason"),warning.reason);
            if(warning.validTill) {
                if(typeof warning.validTill === "object") {
                    embed.addField(language.get("getWarnings.title.validUntil"), `<t:${Math.floor(DateTime.fromJSDate(warning.validTill).toSeconds())}:f>`)
                } else {
                    embed.addField(language.get("getWarnings.title.validUntil"), `<t:${Math.floor(DateTime.fromISO(warning.validTill).toSeconds())}:f>`)
                }
            }
            if(warning.warnerUserId) {
                embed.addField(language.get("getWarnings.title.by"), `<@${warning.warnerUserId}>`);
            }
            if(warning.isGenerated) {
                embed.addField(language.get("getWarnings.title.generated"), language.get("getWarnings.value.generated"));
            }
            return embed;
        }

        let page = 1;

        const row = new MessageActionRow()
            .addComponents(
                buttonManager.decorate(new MessageButton()
                    .setLabel("Prev")
                    .setStyle("PRIMARY")
                    .setCustomId(`${interaction.id}_prev`), (_, int) => {
                        if(page - 1 <= 0) return;
                        page--;
                        int.update({
                            embeds: warnings.slice(page-1*5, page*5).map(map),
                        })
                    }),
                buttonManager.decorate(new MessageButton()
                    .setLabel("Next")
                    .setCustomId(`${interaction.id}_next`)
                    .setStyle("PRIMARY"), (_, int) => {
                        page++;
                        int.update({
                            embeds: warnings.slice(page-1*5, page*5).map(map),
                        })
                    }),
            );
            
        interaction.reply({
            content: "Warnings",
            embeds: warnings.slice(page-1*5, page*5).map(map),
            components: [ row ],
        });
    },
    permissions: [ "KICK_MEMBERS" ],
}


