import { environments } from "../constants/config.js";

function getEnvironment() {
  return typeof window === "undefined" ? environments.node : environments.browser;
}

export const env = getEnvironment();