import { Entity } from "telegram/define"
import { sendMessage } from "."
import { getChatCollections } from "../orchestra/db"
import { ICollection } from "../interfaces/ICollection"

async function list_contracts(chat: Entity) {

  const collections: ICollection[] = getChatCollections(chat.id)

  await sendMessage(chat, 
    [
      'Below are the contracts connected to this channel.\n',
      collections.map(collection => `- <code>${collection.address}</code> (<code>${collection.chain}</code>)`).join('\n')
    ].join('\n'))
}

export default list_contracts