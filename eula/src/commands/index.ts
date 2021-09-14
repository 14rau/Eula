import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageOptions, MessagePayload, PermissionResolvable } from "discord.js";
import { EulaDb } from "eula_db";
import { AutoModManager } from "../lib/AutoModRunner";
import { Language } from "../lib/lang/Language";


export interface Command {
    data: SlashCommandBuilder;
    action: (options: {interaction: CommandInteraction, client: Client, eulaDb: EulaDb, log: (options: string | MessagePayload | MessageOptions) => Promise<void>, autoMod: AutoModManager, language: Language}) => void;
    permissions?: PermissionResolvable[];
    isDev?: boolean;
}