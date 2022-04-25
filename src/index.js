import { ethers } from "ethers";
import abi from "../contract_abi.json" // assert { type: "json" }
import 'dotenv/config'
import fetch from "node-fetch";

const currency = "CRO"

const address = process.env.CONTRACT_ADDRESS
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

const contract = new ethers.Contract(address, abi, provider)

const totalSupply = await contract.totalSupply()
console.log(`Total supply: ${totalSupply}`)

const iface = new ethers.utils.Interface(abi)

// const events = await contract.queryFilter("Transfer", 2461788, 2461790) // mint
// const events = await contract.queryFilter("Transfer", 2466275, 2466277) // transfer


async function statement(tokenId, value, to, from, caption) {

  const tokenURI = await contract.tokenURI(tokenId)
  const tokenData = (await (await fetch(tokenURI)).json())
  // console.log(tokenData)

  console.log(caption)
  console.log(`Name: ${tokenData.name}`)
  console.log(`From: ${from}`)
  console.log(`To: ${to}`)
  console.log(`Amount: ${ethers.utils.formatEther(value)} ${currency}`)
  console.log(`Image: ${tokenData.image}`)

}

function mint(event, tx) {
  const value = tx.value
  const tokenId = event.args.tokenId
  const to = event.args.to
  const from = event.args.from
  statement(tokenId, value, to, from, "JUST MINTED!")
}

function transfer(event, tx) {
  const value = tx.value
  const tokenId = event.args.tokenId
  const to = event.args.to
  const from = event.args.from
  let str
  if (ethers.BigNumber.from("0").eq(value)) {
    statement(tokenId, value, to, from, "JUST TRANFERRED!")
  } else {
    statement(tokenId, value, to, from, "JUST PURCHASED!")
  }
  
}

// events.forEach(async (event) => {
//   const tx = await event.getTransaction()

//   try {
//     // mint
//     const txd = iface.parseTransaction({ data: tx.data, value: tx.value })
//     mint(event, tx)
//   } catch (error) {
//     // transfer
//     transfer(event, tx)
//   }
// });

contract.on("Transfer", async (from, to, amount, event) => {
  console.log("Transfer")
  console.log(`From: ${from}`)
  console.log(`To: ${to}`)
  console.log(`Amount: ${ethers.utils.formatEther(amount)} ${currency}`)
  console.log(event)
})