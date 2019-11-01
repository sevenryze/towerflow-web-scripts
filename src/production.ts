import chalk from "chalk";
import { checkRequiredFiles } from "./helper/check-required-files";
import { Debug } from "./helper/debugger";
import { parsePath } from "./helper/parse-path";
import { BuildType, TowerflowProjectType } from "./interface";
import { runTsc } from "./tsc/run-tsc";
import { runWebpack } from "./webpack/run-webpack";

const debug = Debug(__filename);

export async function production(options: {
  appPath: string;
  appType: TowerflowProjectType;
  ownPath: string;
}) {
  const { ownPath, appPath, appType } = options;

  debug(`Check if required files exists`);
  if (!checkRequiredFiles(appPath)) {
    process.exit(1);
  }

  switch (options.appType) {
    case TowerflowProjectType.WebApp:
      runWebpack({
        appPath,
        appType,
        buildType: BuildType.production,
        distPath: parsePath(options.appPath, "dist"),
        ownPath,
        indexPath: `${options.appPath}/src/index.tsx`,
        publicDirPath: `${options.appPath}/public`
      });
      break;

    case TowerflowProjectType.NodeApp:
    case TowerflowProjectType.NodeLib:
    case TowerflowProjectType.WebLib:
      runTsc({
        appPath,
        appType,
        ownPath,
        type: BuildType.production
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
