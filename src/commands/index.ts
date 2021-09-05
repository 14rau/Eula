import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, PermissionResolvable } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    action: (interaction: CommandInteraction, client: Client) => void;
    permissions?: PermissionResolvable[];
    isDev?: boolean;
}