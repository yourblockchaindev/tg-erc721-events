import { ethers } from "ethers"
import { IProviders } from "./interfaces/IProviders"
import config from "./config.json"

let tmp: IProviders = {}
for(const [key, value] of Object.entries(config.providers)) {
  tmp[key] = new ethers.providers.JsonRpcProvider(value.rpc)
}
const providers: IProviders = tmp

export default providers