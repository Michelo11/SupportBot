import { Client, IntentsBitField } from "discord.js";
import config from "./config";
import * as commandsModule from "./commands/index";
import { createRestApi } from "./rest-api";
const commands = Object(commandsModule);

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
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

const PORT = process.env.PORT || 8000;

const api = createRestApi(client);

api.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});