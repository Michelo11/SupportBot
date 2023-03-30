import { Client, IntentsBitField } from "discord.js";
import config from "./config";
import * as commandsModule from "./commands/index";
import { execute } from "./commands/ping";

const commands = Object(commandsModule);

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
  ],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

client.login(config.DISCORD_TOKEN);