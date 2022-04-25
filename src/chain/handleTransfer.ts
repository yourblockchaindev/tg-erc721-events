import { BigNumber, ethers, Event } from "ethers";
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

async function spentString(amount: BigNumber, collection: ICollection) {
  const coinApiId: string = providers[collection.chain].coinApiId;

  const coin = await CoinGeckoClient.coins.fetch(coinApiId, {
    market_data: true,
  });
  const price = coin.data.market_data.current_price.usd;
  const spent = parseFloat(ethers.utils.formatEther(amount)) * price;
  const remainder = amount.mod(1e14);
  const value = amount.sub(remainder);
  return `<b>Spent</b>: ${currencyFormatter.format(
    spent
  )} (${ethers.utils.formatEther(value)} ${coin.data.symbol})`;
}

function iconString(amount: BigNumber) {
  let nbIcons = Math.floor(amount.div(BigNumber.from("100")).toNumber()) + 1;
  return "🦍".repeat(nbIcons);
}

async function linkString(to: string, event: Event, collection: ICollection) {
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
  amount: BigNumber,
  event: Event,
  // chatId: bigInt.BigInteger,
  collection: ICollection,
  contract: ethers.Contract
) {
  try {
    const tokenId = event.args?.tokenId;
    console.log(`TokenId: ${tokenId}`)
    const tokenURI = await contract.tokenURI(tokenId);
    console.log(`TokenURI: ${tokenURI}`)

    const tokenUrl = safeUrl(tokenURI)
    const response = await fetch(tokenUrl)
    const data: ITokenData = await response.json()

    const message = [
      `<b>Transfer: ${data.name}!</b>`,
      iconString(amount),
      await spentString(amount, collection),
      await linkString(to, event, collection),
    ].join("\n");

    await sendMedia(collection.chatId, message, safeUrl(data.image));
  } catch (error) {
    console.error(error);
  }
}

export default handleTransfer;
