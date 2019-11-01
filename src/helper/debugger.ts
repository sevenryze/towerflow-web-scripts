import debug, { Debugger } from "debug";
import path from "path";

export function Debug(filename: string): Debugger {
  return debug(`towerflow-web-scripts:${path.basename(filename, ".js")} ---> `);
}
