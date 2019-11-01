#!/usr/bin/env node

import { Debug } from "../src/helper/debugger";
import crossSpawn from "cross-spawn";

const debug = Debug(__filename);

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

const args = process.argv.slice(2);

const scriptIndex = args.findIndex(x => x === "build" || x === "eject" || x === "start" || x === "test");
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (["build", "eject", "start", "test"].includes(script)) {
  const result = crossSpawn.sync(
    "node",
    nodeArgs.concat(require.resolve("../src/" + script)).concat(args.slice(scriptIndex + 1)),
    { stdio: "inherit" }
  );
  if (result.signal) {
    if (result.signal === "SIGKILL") {
      console.log(
        "The build failed because the process exited too early. " +
          "This probably means the system ran out of memory or someone called " +
          "`kill -9` on the process."
      );
    } else if (result.signal === "SIGTERM") {
      console.log(
        "The build failed because the process exited too early. " +
          "Someone might have called `kill` or `killall`, or the system could " +
          "be shutting down."
      );
    }
    process.exit(1);
  }
  process.exit(result.status ? result.status : -1);
} else {
  console.log('Unknown script "' + script + '".');
  console.log("Perhaps you need to update towerflow-web-scripts?");
  console.log("See: https://github.com/sevenryze/towerflow-web-scripts");
}
