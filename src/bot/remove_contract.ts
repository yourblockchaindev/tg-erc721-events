import { Api } from "telegram";
import { Entity } from "telegram/define";
import { sendMessage } from ".";
import { remove } from "../orchestra/conductor";
import { exists } from "../orchestra/db";
import { ICollection } from "../interfaces/ICollection"

async function remove_contract(chat: Entity, message: Api.Message) {
  const [cmd, address, chain] = message.text.split(" ");

  const collection: ICollection = { chatId: chat.id.toJSON(), chain, address }
  if (exists(collection)) {
    // if exists in db, remove
    await remove(collection)
    await sendMessage(chat, `Removed contract <code>${address}</code> (<code>${chain}</code>).`)
  } else {
    // else
    await sendMessage(chat, `We didn't find contract <code>${address}</code> (<code>${chain}</code>) for this chat.`)
  }
}

export default remove_contract