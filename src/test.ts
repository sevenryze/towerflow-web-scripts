import { checkRequiredFiles } from "./helper/check-required-files";
import { Debug } from "./helper/debugger";
import { TowerflowProjectType } from "./interface";
import { runJest } from "./jest/run-jest";

const debug = Debug(__filename);

export async function test(options: {
  appName: string;
  appPath: string;
  appType: TowerflowProjectType;
  ownPath: string;
}) {
  const { appName, ownPath, appPath, appType } = options;

  debug(`Check if required files exists`);
  if (!checkRequiredFiles(appPath)) {
    process.exit(1);
  }

  runJest(options);
}
