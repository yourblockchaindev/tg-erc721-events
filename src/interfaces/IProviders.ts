import { ethers } from 'ethers'

export interface IProviders {
  [key: string]: ethers.providers.JsonRpcProvider
}