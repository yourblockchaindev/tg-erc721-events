import { ethers, Event } from "ethers";
import "dotenv/config";
import fetch from "node-fetch";
import CoinGecko from "coingecko-api";
import { sendMedia } from "../bot";
import { ICollection } from "../interfaces/ICollection";
import config from "../config.json";
import { IProviderDict } from "../interfaces/IProviderData";

const providers: IProviderDict = config.providers;
const IPFS_URL = "https://ipfs.io/ipfs/"
const IPFS_PATTERN = "ipfs://"

interface ITokenData {
  name: string;
  image: string;
}

const CoinGeckoClient = new CoinGecko();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

async function coinInfo(collection: ICollection) {
  const coinApiId: string = providers[collection.chain].coinApiId;

  const coin = await CoinGeckoClient.coins.fetch(coinApiId, {
    market_data: true,
  });
  const symbol = coin.data.symbol.toUpperCase()
  const rate = coin.data.market_data.current_price.usd;
  return { symbol, rate }
}

function spentString(tokenValue: number, usdValue: number, symbol: string) {
  return [
    '<b>Spent</b>:',
    currencyFormatter.format(usdValue),
    `(${tokenValue.toFixed(2)} ${symbol})`
  ].join(' ')
}

function iconString(usdValue: number) {
  let nbIcons = Math.floor(usdValue/50) + 1;
  return "🦍".repeat(nbIcons);
}

function linkString(to: string, event: Event, collection: ICollection) {
  const explorerUrl: string = providers[collection.chain].explorerUrl;

  return [
    `<a href="${explorerUrl}/tx/${event.transactionHash}">TX</a>`,
    `<a href="${explorerUrl}/address/${to}">Buyer</a>`,
    // `<a href="https://tofunft.com/nft/cronos/${collection.address}/${event.args?.tokenId}">View</a>`,
  ].join(" | ");
}

function safeUrl(url: string): string {
  if (url.startsWith(IPFS_PATTERN)) {
    const path = url.slice(url.indexOf(IPFS_PATTERN) + IPFS_PATTERN.length)
    url = IPFS_URL.concat(path)
  }
  return url
}

export async function handleTransfer(
  from: string,
  to: string,
  tokenId: number,
  event: Event,
  collection: ICollection,
  contract: ethers.Contract
) {
  try {
    const tx = await event.getTransaction()

    const tokenURI = await contract.tokenURI(tokenId);
    const tokenUrl = safeUrl(tokenURI)

    const response = await fetch(tokenUrl)
    const data: ITokenData = await response.json()
    const imageUrl = safeUrl(data.image)

    const { symbol, rate } = await coinInfo(collection)
    
    const tokenValue = Number(ethers.utils.formatEther(tx.value))
    const usdValue = tokenValue * rate

    const message = [
      `<b>Transfer: ${data.name}!</b>`,
      iconString(usdValue),
      spentString(tokenValue, usdValue, symbol),
      linkString(to, event, collection),
      `<b>${symbol} Price:</b> ${currencyFormatter.format(rate)}`
    ].join("\n");

    await sendMedia(collection.chatId, message, imageUrl);

    if (process.env.DEMO_CHAT_ID !== undefined && collection.chatId !== process.env.DEMO_CHAT_ID) {
      await sendMedia(process.env.DEMO_CHAT_ID, message, imageUrl)
    }
  } catch (error) {
    console.error(error);
  }
}

export default handleTransfer;
