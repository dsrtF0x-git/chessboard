import { env } from "./determine-environment.js";
import { environments } from "../constants/config.js";
import { Display } from "../display.js";
import { DisplayCLI } from "../displayCLI.js";

export function createRenderComponent(board) {
  switch (env) {
    case environments.browser: return new Display(board);
    case environments.node: return new DisplayCLI(board);
    default: throw new Error("Wrong environment");
  }
}