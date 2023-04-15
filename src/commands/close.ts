import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  TextChannel,
} from "discord.js";
import { createTicket } from "../firebase";

export const data = new SlashCommandBuilder()
  .setName("close")
  .setDescription("Mark Ticket as Resolved");

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: Client
) {
  if (!interaction?.channelId) {
    return;
  }

  await interaction.reply("Ticket Closed");
  interaction.channel?.delete();
}
