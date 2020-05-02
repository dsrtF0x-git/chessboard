import { env } from "./helpers/determine-environment.js";
import { environments } from "./constants/config.js";
import { launchCLIGame } from "./nodeLauncher.js";
import { launchBrowserGame } from "./browserLauncher.js";
const isFirstGameSetup = true;
let browserCurrentGame;

if (env === environments.browser) {
  launchBrowserGame(isFirstGameSetup);
} else {
  launchCLIGame(isFirstGameSetup);
}

export { browserCurrentGame };