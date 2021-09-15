import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from ".";


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("testCommand"),
        action: ({ interaction, client, language }) => {

        interaction.reply({
             content: language.get("test", { test: "PANDA" }),
             ephemeral: true,
        });
    },
    isDev: true,
    permissions: [ "ADMINISTRATOR" ],
}


