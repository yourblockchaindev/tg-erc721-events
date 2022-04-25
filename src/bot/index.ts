import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import "dotenv/config";
import { NewMessage } from "telegram/events";
import { EntityLike } from "telegram/define";
import { _parseMessageText } from "telegram/client/messageParse";
import handleBotEvent from "./handleEvent";

const stringSession = ""; // leave this empty for now

const API_ID = parseInt(process.env.API_ID || "");
const API_HASH = process.env.API_HASH || "";
const BOT_TOKEN = process.env.BOT_TOKEN || "";

console.log("Configuring telegram bot...");
console.log(`API_ID: ${API_ID}`);
console.log(`API_HASH: ${API_HASH}`);
console.log(`BOT_TOKEN: ${BOT_TOKEN}`);

const client = new TelegramClient(
  new StringSession(stringSession),
  API_ID,
  API_HASH,
  { connectionRetries: 5 }
);
client.setParseMode("html")

export async function start() {
  await client.start({
    botAuthToken: BOT_TOKEN,
  });
  console.log("You should now be connected.");
  // USE THIS STRING TO AVOID RELOGGING EACH TIME
  console.log(await client.session.save());
  client.addEventHandler(handleBotEvent, new NewMessage({}));
  return client;
}

export async function sendMedia(
  entity: EntityLike,
  message: string,
  mediaURL: string
) {
  const result = await client.sendFile(entity, {
    file: new Api.InputMediaPhotoExternal({ url: mediaURL }),
    caption: message,
    parseMode: "html",
  })

  console.log(`Message sent.`)
}

export async function sendMessage(entity: EntityLike, message: string) {
  await client.sendMessage(entity, { message, parseMode: "html" })
}

export async function getParticipant(channel: any, participant: any) {
  const result = await client.invoke(
    new Api.channels.GetParticipant({
      channel,
      participant
    })
  );
  return result
}