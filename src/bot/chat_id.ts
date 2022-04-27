import { Entity } from "telegram/define";
import { sendMessage } from ".";

async function chat_id(chat: Entity) {
  await sendMessage(chat, `The chatId is <code>${chat.id}</code>.`);
}

export default chat_id