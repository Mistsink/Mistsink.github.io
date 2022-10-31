// run in node mode
import fs from "fs";
import { resolveNavState, DirState, resolveSidebar, ignoreDirs } from "./dirResolve";


let curDir = fs.readdirSync(".");
curDir = curDir.filter(
  (fsName) =>
    !fsName.startsWith(".") &&
    fs.statSync(fsName).isDirectory() &&
    ignoreDirs.indexOf(fsName) == -1
);

export const navDirStates: DirState[] = [];

// init nav
for (const dirName of curDir) {
  const dirState = resolveNavState(dirName);
  navDirStates.push(dirState);
}


export const sidebarState = resolveSidebar(navDirStates)


