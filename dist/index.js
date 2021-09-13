"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var fs = require("fs");
var discord_js_1 = require("discord.js");
var DataLoader_1 = require("./lib/DataLoader");
var rest_1 = require("@discordjs/rest");
var v9_1 = require("discord-api-types/v9");
var rest = new rest_1.REST({ version: '9' }).setToken(process.env.token);
function ensureGuildSettings(guildId, dataLoader) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!dataLoader.data[guildId]) return [3 /*break*/, 2];
                    dataLoader.data[guildId] = {
                        ignoredUsers: [],
                        urlFilter: false,
                        automod: {
                            active: false,
                            actionAfter: 3,
                            action: "KICK",
                            actionInterval: 10000,
                        }
                    };
                    return [4 /*yield*/, dataLoader.save()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function automig(dataLoader) {
    return __awaiter(this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            console.log(dataLoader.data);
            for (key in dataLoader.data) {
                if (!(dataLoader.data[key]["automod"])) {
                    dataLoader.data[key]["automod"] = {
                        active: false,
                        actionAfter: 3,
                        action: "KICK",
                        actionInterval: 10000,
                    };
                }
            }
            dataLoader.save();
            return [2 /*return*/];
        });
    });
}
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var settings, client, commandFiles, functions, commands, _i, commandFiles_1, file, command, cmd;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settings = new DataLoader_1.DataLoader("localdb.json", {});
                    return [4 /*yield*/, settings.init()];
                case 1:
                    _a.sent();
                    settings.loadFrom("../../localdb.json");
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    }); }, 500);
                    client = new discord_js_1.Client({
                        intents: [discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILDS],
                    });
                    commandFiles = fs.readdirSync('./dist/commands').filter(function (file) { return file.endsWith('.js') && !file.includes("index"); });
                    functions = new Map();
                    commands = [];
                    for (_i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
                        file = commandFiles_1[_i];
                        command = require("./commands/" + file);
                        cmd = command.command.data.toJSON();
                        if (!process.argv.includes("--devMode") && cmd.devMode)
                            continue;
                        commands.push(cmd);
                        functions.set(cmd.name, command.command);
                    }
                    return [4 /*yield*/, client.login(process.env.token)];
                case 2:
                    _a.sent();
                    global.settings = settings;
                    client.on("ready", function () { return __awaiter(_this, void 0, void 0, function () {
                        var error_1, serverCmdIndex, server, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Bot started successfully");
                                    client.user.setActivity({
                                        type: "STREAMING",
                                        name: "Vengeance will be mine!"
                                    });
                                    if (!!process.argv.includes("--devMode")) return [3 /*break*/, 5];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    console.log('Started refreshing application (/) commands.');
                                    return [4 /*yield*/, rest.put(v9_1.Routes.applicationCommands(client.application.id), { body: commands })];
                                case 2:
                                    _a.sent();
                                    console.log('Successfully reloaded application (/) commands.');
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    console.error(error_1);
                                    return [3 /*break*/, 4];
                                case 4: return [3 /*break*/, 8];
                                case 5:
                                    _a.trys.push([5, 7, , 8]);
                                    console.log('Started refreshing application (/) commands.');
                                    serverCmdIndex = process.argv.indexOf("-s");
                                    server = process.argv[serverCmdIndex !== -1 ? serverCmdIndex + 1 : -1];
                                    return [4 /*yield*/, rest.put(v9_1.Routes.applicationGuildCommands(client.application.id, server !== null && server !== void 0 ? server : "758384067934158858"), { body: commands })];
                                case 6:
                                    _a.sent();
                                    console.log('Successfully reloaded application (/) commands.');
                                    return [3 /*break*/, 8];
                                case 7:
                                    error_2 = _a.sent();
                                    console.error(error_2);
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                    client.on("messageCreate", function (message) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if ((_a = settings.data[message.guild.id]) === null || _a === void 0 ? void 0 : _a.ignoredUsers.includes(message.author.id))
                                        message.delete();
                                    if (!((_b = settings.data[message.guild.id]) === null || _b === void 0 ? void 0 : _b.urlFilter)) return [3 /*break*/, 2];
                                    if (!message.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) return [3 /*break*/, 2];
                                    if (!!(message.member.permissions.has("ADMINISTRATOR") || message.member.permissions.has("MANAGE_MESSAGES"))) return [3 /*break*/, 2];
                                    if (message.content.startsWith("https://tenor.com/view/"))
                                        return [2 /*return*/];
                                    return [4 /*yield*/, message.delete()];
                                case 1:
                                    _c.sent();
                                    message.channel.send("Das Posten von Links ist untersagt.");
                                    _c.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    client.on("interactionCreate", function (er) { return __awaiter(_this, void 0, void 0, function () {
                        var cmd, perm_1, err_1;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!er.isCommand()) return [3 /*break*/, 4];
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, ensureGuildSettings(er.guildId, settings)];
                                case 2:
                                    _d.sent();
                                    cmd = functions.get(er.commandName);
                                    perm_1 = (_a = er.member) === null || _a === void 0 ? void 0 : _a.permissions;
                                    if (!cmd.permissions || ((_b = cmd.permissions) === null || _b === void 0 ? void 0 : _b.every(function (e) { return perm_1.has(e); }))) {
                                        (_c = cmd.action) === null || _c === void 0 ? void 0 : _c.call(cmd, er, client);
                                    }
                                    else {
                                        er.reply({
                                            content: "...Schlecht [MISSING PERM]",
                                            ephemeral: true,
                                        });
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _d.sent();
                                    er.reply({
                                        content: "[ERR] I will have my vengeance... someday",
                                        ephemeral: true,
                                    });
                                    console.log(err_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
