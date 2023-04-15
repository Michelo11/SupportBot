import { Client, TextChannel, ChannelType } from "discord.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Request, Response } from "express";
import { createTicket, getTicket, getTicketById } from "./firebase";
import cors from "cors";

export function createRestApi(client: Client) {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });
  app.use(express.json());
  app.use(cors());

  io.on("connection", socket => {
    socket.on("join", (room) => {
      socket.join(room)
    })
  })

  client.on("messageCreate", async message => {
    const ticket = await getTicketById(message.channel.id);
    if (!ticket) return;

    io.to(ticket.secret).emit("message", {
      bot: message.author.bot,
      ...message,
    });
  })

  app.get("/messages", async (req, res) => {
    const thread = await getThread(req, res);
    if (!thread) return;

    const messages = await thread?.messages.fetch({
      cache: false,
    });
    return res.status(200).json(
      messages?.map((m) => {
        return {
          bot: m.author.bot,
          ...m,
        };
      }) || []
    );
  });

  app.post("/messages", async (req, res) => {
    const { text } = req.body;
    const thread = await getThread(req, res);
    if (!thread) return;

    await thread.send(text);
    return res.status(200).send("Message sent");
  });

  app.post("/new", async (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Missing text or username" });
    }
    const channel = await client.guilds.cache
      .get("1068214999304110222")!!
      .channels.create({
        name: `ticket-${username}`,
        type: ChannelType.GuildText,
        parent: "1068215000558219264",
      });

    const secret = await createTicket(channel.id);

    channel.send("<@573539095452844052>").then((m) => m.delete());

    res.json({ secret });
  });

  async function getThread(
    req: Request,
    res: Response
  ): Promise<TextChannel | undefined> {
    const { secret } = req.query;
    if (!secret) {
      res.status(400).json({ error: "Missing secret" });
      return undefined;
    }

    const ticket = await getTicket(secret as string);

    const thread = client.channels.cache.get(ticket?.threadId) as TextChannel;
    if (!thread) {
      res.status(404).json({ error: "Thread with this id was not found" });
      return undefined;
    }
    return thread;
  }

  return server;
}
