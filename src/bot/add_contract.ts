import { isAddress } from "ethers/lib/utils";
import { Api } from "telegram";
import { Entity } from "telegram/define";
import { sendMessage } from ".";
import config from "../config.json"
import { add } from "../orchestra/conductor";
import { exists } from "../orchestra/db";

function isSupportedChain(chain: string) {
  return chain in config.providers;
}

async function add_contract(chat: Entity, message: Api.Message) {
  const [cmd, address, chain] = message.text.split(" ");

  // verify valid address
  if (!isAddress(address)) {
    await sendMessage(
      chat,
      `The address <code>${address}</code> is invalid. Please try again making sure you are using a standard EIP-55 address format.`
    );
    return;
  }
  // verify valid chain
  if (!isSupportedChain(chain)) {
    await sendMessage(
      chat,
      [
        `The chain <code>${chain}</code> is unsupported. Please try again.`,
        `<b>Supported Chains:</b>`,
        Object.keys(config.providers)
          .map((key) => `- <code>${key}</code>`)
          .join("\n"),
      ].join("\n\n")
    );
    return;
  }

  // add to db
  const collection = { chatId: chat.id.toJSON(), chain, address }
  if (!exists(collection)) {
    await add(collection)
    await sendMessage(chat, `Success! Contract <code>${address}</code> (<code>${chain}</code>) added. 🥳`)
  } else {
    await sendMessage(chat, `The contract <code>${address}</code> (<code>${chain}</code>) is already added.`)
  }
}

export default add_contract