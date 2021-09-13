"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
var builders_1 = require("@discordjs/builders");
exports.command = {
    data: new builders_1.SlashCommandBuilder()
        .setName('allow')
        .addUserOption(function (option) { return option.setName('target').setDescription('Select a user').setRequired(true); })
        .setDescription('allow a user to write again'),
    action: function (interaction, client) {
        var member = interaction.options.getUser("target");
        var data = new Set(global.settings.data[interaction.guildId].ignoredUsers);
        data.delete(member.id);
        global.settings.data[interaction.guildId].ignoredUsers = Array.from(data);
        global.settings.save();
        interaction.reply("Vengeance... was enough for " + member.username);
    },
    permissions: ["ADMINISTRATOR"],
};
