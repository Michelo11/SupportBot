import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "./config";
import { SlashCommandBuilder } from "discord.js";
import * as commandsModule from "./commands/index";

type Commands = {
  data: unknown
};

const commands = [];

for (const module of Object.values<Commands>(commandsModule)) {
  commands.push(module.data);
}

const rest = new REST({ version: "9" }).setToken(config.DISCORD_TOKEN);

rest
  .put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
    body: commands,
  })
  .then(() => {
    console.log("Successfully registered application commands.");
  })
  .catch(console.error);
