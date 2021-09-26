import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from ".";
import { WarningExport } from "eula_db";
import { MessageAttachment } from "discord.js";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("export")
        .setDescription("Export Module")
        .addSubcommand((e) =>
            e.setName("warnings")
            .setDescription("Export warnings")
            .addBooleanOption(e =>
                e.setName("show_expired_warnings")
                .setDescription("Show expired warnings or not in export")
            )
        )
        ,
        action: async ({ interaction, client, language, eulaDb, log }) => {
            switch(interaction.options.getSubcommand()) {
                case "warnings": {
                    const exporter = new WarningExport(eulaDb);
                    const file = await exporter.run(interaction.guildId, { includeExpired: interaction.options.getBoolean("show_expired_warnings") ?? false });
                    if(Buffer.isBuffer(file)) {
                        interaction.reply({
                            files: [ new MessageAttachment(file, "warnings.xlsx") ],
                            ephemeral: true
                        })
                    } else {
                        interaction.reply({
                            content: "There was an issue with the file export",
                            ephemeral: true
                        })
                    }
                }
            }
        },
    permissions: [ "ADMINISTRATOR" ],
}


