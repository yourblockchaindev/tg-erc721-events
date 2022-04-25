import { start } from "./bot";
import { run } from "./orchestra/conductor";

(async() => {
  await start()
  run()
})()