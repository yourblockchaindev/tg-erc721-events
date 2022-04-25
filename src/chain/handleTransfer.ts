import { BigNumber, ethers, Event } from "ethers";
import abi from "../abi.json"; 
import "dotenv/config";
import fetch from "node-fetch";
import CoinGecko from "coingecko-api";
import { sendMedia } from "../bot";

interface ITokenData {
  name: string
  image: string
}

const address = process.env.CONTRACT_ADDRESS || "";
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

export const contract = new ethers.Contract(address, abi, provider);

const CoinGeckoClient = new CoinGecko();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

async function spentString(amount: BigNumber) {
  const coin = await CoinGeckoClient.coins.fetch("crypto-com-chain", {
    market_data: true,
  });
  const price = coin.data.market_data.current_price.usd;
  const spent = parseFloat(ethers.utils.formatEther(amount)) * price;
  const remainder = amount.mod(1e14);
  const value = amount.sub(remainder);
  return `<b>Spent</b>: ${currencyFormatter.format(
    spent
  )} (${ethers.utils.formatEther(value)} CRO)`;
}

function iconString(amount: BigNumber) {
  let nbIcons = Math.floor(amount.div(BigNumber.from("100")).toNumber()) + 1;
  return "🦍".repeat(nbIcons)
}

async function linkString(event: Event, to: string) {
  return [
    `<a href="https://cronoscan.com/tx/${event.transactionHash}">TX</a>`,
    `<a href="https://cronoscan.com/address/${to}">Buyer</a>`,
    `<a href="https://tofunft.com/nft/cronos/${address}/${event.args?.tokenId}">View</a>`,
  ].join(" | ")
}

export async function handleTransfer(
  from: string,
  to: string,
  amount: BigNumber,
  event: Event,
  chatId: bigInt.BigInteger,
) {
  try {  
    const tokenId = event.args?.tokenId;
    const tokenURI = await contract.tokenURI(tokenId);
    const data: ITokenData = (await (await fetch(tokenURI)).json()) as ITokenData;

    const message = [
      `<b>Transfer: ${data.name}!</b>`,
      iconString(amount),
      await spentString(amount),
      await linkString(event, to)
    ].join("\n");
    
    await sendMedia(chatId, message, data.image);
  } catch (error) {
    console.error(error)
  }
}

export default handleTransfer