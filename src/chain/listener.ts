import { ethers } from "ethers";
import abi from "../abi.json";
import providers from "../providers";
import { handleTransfer } from "./handleTransfer";
import { ICollection } from "../interfaces/ICollection";

class Listener {
  collection: ICollection;
  contract: ethers.Contract;
  provider: ethers.providers.BaseProvider;
  id: number;

  constructor(collection: ICollection, id: number) {
    this.collection = collection;
    this.provider = providers[collection.chain];
    this.contract = new ethers.Contract(collection.address, abi, this.provider);
    this.id = id;
  }

  start() {
    this.contract.on("Transfer", async (from, to, tokenId, event) => {
      console.log(`New Event: ${event.transactionHash}`);
      await handleTransfer(
        from,
        to,
        tokenId,
        event,
        this.collection,
        this.contract,
      );
    });
    console.log(`Listening for chatId: ${this.collection.chatId}`);
  }

  stop() {
    console.log(`stop(): ${this.collection.chatId}`);
    this.contract.off("Transfer", () => {});
  }
}

export default Listener;
