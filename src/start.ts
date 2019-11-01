import chalk from "chalk";
import { checkRequiredFiles } from "./helper/check-required-files";
import { Debug } from "./helper/debugger";
import { parsePath } from "./helper/parse-path";
import { BuildType, TowerflowProjectType } from "./interface";
import { runTsc } from "./tsc/run-tsc";
import { runWebpack } from "./webpack/run-webpack";

const debug = Debug(__filename);

export async function start(options: {
  appPath: string;
  appType: TowerflowProjectType;
  ownPath: string;
  port: number;
}) {
  const { ownPath, appPath, appType, port } = options;

  debug(`Check if required files exists`);
  if (!checkRequiredFiles(appPath)) {
    process.exit(1);
  }

  switch (options.appType) {
    case TowerflowProjectType.WebApp:
    case TowerflowProjectType.WebLib:
      runWebpack({
        port,
        appPath,
        appType,
        buildType: BuildType.dev,
        distPath: parsePath(options.appPath, "dist"),
        ownPath,
        indexPath:
          options.appType === TowerflowProjectType.WebApp
            ? `${options.appPath}/src/index.tsx`
            : `${options.appPath}/human-test/index.tsx`,
        publicDirPath:
          options.appType === TowerflowProjectType.WebApp
            ? `${options.appPath}/public`
            : `${options.appPath}/human-test/public`
      });
      break;

    case TowerflowProjectType.NodeApp:
    case TowerflowProjectType.NodeLib:
      runTsc({
        appPath,
        appType,
        ownPath,
        type: BuildType.dev
      });
      break;
    default:
      console.log(
        `The template argument gets Unknown type, valid type: ${chalk.green(
          "F* you! dummy suck loser, you gonna typing everything wrong?"
        )}`
      );
      process.exit(1);
  }
}
