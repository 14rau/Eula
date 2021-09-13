"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
var builders_1 = require("@discordjs/builders");
var discord_js_1 = require("discord.js");
var luxon_1 = require("luxon");
exports.command = {
    data: new builders_1.SlashCommandBuilder()
        .setName("about")
        .setDescription("Show some informations about eula"),
    action: function (interaction, client) {
        var exampleEmbed = new discord_js_1.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Eula - about")
            .setDescription("Eula is a simple message deletion bot. You can filter for specific words, regex or generally disable URL postings. In case you just want the message from someone be deleted, i can also make Eula do this!")
            .addField("Uptime", "" + luxon_1.Duration.fromMillis(client.uptime).toFormat("hh:mm"));
        var row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setLabel("Invite")
            .setStyle("LINK")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=880880243873832990&permissions=2147493888&scope=bot"), new discord_js_1.MessageButton()
            .setLabel("Support")
            .setStyle("LINK")
            .setURL("https://discord.gg/Zmtr88WBBx"));
        interaction.reply({
            embeds: [exampleEmbed],
            components: [row],
            ephemeral: true,
        });
    },
    permissions: ["ADMINISTRATOR"],
};
