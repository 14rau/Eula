import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageOptions, MessagePayload, PermissionResolvable } from "discord.js";
import { EulaDb } from "eula_db";
import { AutoModManager } from "../lib/AutoModRunner";
import { Language } from "../lib/lang/Language";
import { LogManager } from "../lib/LogRunner";


export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandSubcommandsOnlyBuilder;
    action: (options: {interaction: CommandInteraction, client: Client, eulaDb: EulaDb, log: LogManager, autoMod: AutoModManager, language: Language}) => void;
    permissions?: PermissionResolvable[];
    isDev?: boolean;
}