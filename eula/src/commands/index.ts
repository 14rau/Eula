import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageOptions, MessagePayload, PermissionResolvable } from "discord.js";
import { EulaDb } from "eula_db";
import { AutoModManager } from "../lib/AutoModRunner";
import { LogClient } from "../lib/LogClient";

export interface Command {
    data: SlashCommandBuilder;
    action: (interaction: CommandInteraction, client: Client, eulaDb: EulaDb, log: (options: string | MessagePayload | MessageOptions) => Promise<void>, autoMod: AutoModManager) => void;
    permissions?: PermissionResolvable[];
    isDev?: boolean;
}