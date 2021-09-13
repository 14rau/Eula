"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
var builders_1 = require("@discordjs/builders");
exports.command = {
    data: new builders_1.SlashCommandBuilder()
        .setName('ignore')
        .addUserOption(function (option) { return option.setName('target').setDescription('Select a user'); })
        .setDescription('Will ignore an user!'),
    action: function (interaction, client) {
        var member = interaction.options.getUser('target');
        global.settings.data[interaction.guildId].ignoredUsers = Array.from(new Set(global.settings.data[interaction.guildId].ignoredUsers).add(member.id));
        global.settings.save();
        interaction.reply(member.username + ", Vengeance will be mine!");
    },
    permissions: ["ADMINISTRATOR"],
};
