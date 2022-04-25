import { Entity } from "telegram/define";
import { sendMessage } from ".";

async function start(chat: Entity) {
  await sendMessage(
    chat,
    [
      `Hi! I am R3vealBot, I am ready to start monitoring some NFT buys together!`,
      'Please note that this is the Free Version of R3vealBot and so there are ads!\n',
      `<b>Available Commands:</b>\n`,
      `- /add_contract address chain`,
      `- /remove_contract address chain`,
      `- /list_contracts`,
      '',
      'Official Group: @R3vealBotChat',
    ].join("\n")
  );
}

export default start