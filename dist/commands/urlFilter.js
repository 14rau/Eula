"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
var builders_1 = require("@discordjs/builders");
exports.command = {
    data: new builders_1.SlashCommandBuilder()
        .setName("urlfilter")
        .addBooleanOption(function (e) { return e.setName("status").setDescription("The set status"); })
        .setDescription("Users with 'Administrator' or 'Manage Message' are still allowed to post links."),
    action: function (interaction, client) {
        var status = interaction.options.getBoolean("status");
        global.settings.data[interaction.guildId].urlFilter = status;
        global.settings.save();
        interaction.reply("Url filter was set to `" + status + "`");
    },
    permissions: ["ADMINISTRATOR"],
    isDev: true,
};
