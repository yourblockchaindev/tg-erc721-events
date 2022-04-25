export interface IProviderDict {
  [key: string]: IProviderData
}

export interface IProviderData {
  rpc: string
  explorerUrl: string
  coinApiId: string
}