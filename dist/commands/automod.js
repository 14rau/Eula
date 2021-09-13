"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
var builders_1 = require("@discordjs/builders");
exports.command = {
    data: new builders_1.SlashCommandBuilder()
        .setName("automod")
        .addBooleanOption(function (e) { return e.setName("status").setDescription("The given Status"); })
        .addIntegerOption(function (e) { return e.setName("take_action_after").setDescription("Take action after"); })
        .addStringOption(function (e) { return e.setName("taken_action").setDescription("The taken action")
        .addChoices([["Kick", "KICK"], ["Ban", "BANN"]]); })
        .addIntegerOption(function (e) { return e.setName("remember_for_x_minutes").setDescription("How many minutes Eula will remember the action"); })
        .setDescription("Enables/Disables the automod and set accordingly the settings"),
    action: function (interaction, client) {
        var status = interaction.options.getBoolean("status");
        global.settings.data[interaction.guildId].automod["active"] = status;
        global.settings.save();
        interaction.reply("Url filter was set to `" + status + "`");
    },
    permissions: ["ADMINISTRATOR"],
    isDev: true,
};
