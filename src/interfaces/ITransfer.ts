import { ethers } from 'ethers'

export interface ITransfer {
  from: string
  to: string
  amount: ethers.BigNumber
  event: ethers.Event
}