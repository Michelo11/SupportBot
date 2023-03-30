import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  TextChannel,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Creates a help ticket.")
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Describe your problem")
      .setRequired(true)
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: Client
) {
  if (!interaction?.channelId) {
    return;
  }
  const channel = await client.channels.fetch(interaction.channelId);
  if (!channel || channel.type !== ChannelType.GuildText) {
    return;
  }
  const thread = await (channel as TextChannel).threads.create({
    name: `support-${Date.now()}`,
    reason: `Support Ticket ${Date.now()}`,
  });

  const problemDescription = interaction.options.getString("description")!;
  const { user } = interaction;
  thread.send(`**User:** <@${user.id}>\n**Problem:** ${problemDescription}`);
  return interaction.reply({
    content: `Help is on the way!: ${thread}`,
    ephemeral: true,
  });
}
