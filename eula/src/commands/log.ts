import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("log")
        .setDescription("Log module")
        .addSubcommand((e) =>
            e.setName("enable")
            .setDescription("enable loggging")
            .addBooleanOption(e =>
                e.setName("enable")
                .setDescription("Log or not")
                .setRequired(true)
            )
        )
        .addSubcommand((e) =>
            e.setName("join")
            .setDescription("Log joins")
            .addBooleanOption(e =>
                e.setName("enable")
                .setDescription("Log or not join")
                .setRequired(true)
            )
        )

        ,
        action: async ({ interaction, client, language, eulaDb, log }) => {
            await eulaDb.settingClient.setSetting(interaction.guildId, `log.${interaction.options.getSubcommand()}`, `${interaction.options.getBoolean("enable")}`, "bool");
            log.refreshRunner(interaction.guildId);
            console.log(interaction)
            interaction.reply({
                content: language.get("log.setTo", { name: interaction.options.getSubcommand(), value: `${interaction.options.getBoolean("enable")}` }),
                ephemeral: true,
            });
        },
    isDev: true,
    permissions: [ "ADMINISTRATOR" ],
}


