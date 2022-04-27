import { Api } from "telegram";
import { Entity } from "telegram/define";
import { NewMessageEvent } from "telegram/events";
import { getParticipant } from ".";
import add_contract from "./add_contract";
import chat_id from "./chat_id";
import list_contracts from "./list_contracts";
import remove_contract from "./remove_contract";
import start from "./start";

const roles = {
  "ChannelParticipantAdmin": {},
  "ChannelParticipantCreator": {}
}

const commands = ["/start", "/add_contract", "/remove_contract", "/list_contracts", "/chat_id"]

async function isAdmin(chat: Entity, message: Api.Message) {
  const sender = await message.getSender()
  const result = await getParticipant(chat, sender)
  const role = result.participant.className
  return (role in roles)
}

async function handleEvent(event: NewMessageEvent) {
  const message = event.message as Api.Message;
  const chat: Entity = (await message.getChat()) as Entity;
  const cmd = message.text.split(" ")[0];
  
  if (!(await isAdmin(chat, message))) return
  if (!(commands.includes(cmd))) return

  console.log(`ChatId: ${chat.id}`)
  console.log(`Message: ${message.text}`)  

  switch (cmd) {
    case commands[0]:
      await start(chat);
      break;
    case commands[1]:
      await add_contract(chat, message);
      break;
    case commands[2]:
      await remove_contract(chat, message);
      break;
    case commands[3]:
      await list_contracts(chat);
      break;
    case commands[4]:
      await chat_id(chat);
      break;
    default:
      break;
  }
}

export default handleEvent;