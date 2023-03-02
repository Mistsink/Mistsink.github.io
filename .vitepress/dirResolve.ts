import fs from "fs";
import { load } from "js-yaml";

export const ignoreDirs = ["images", "public", "node_modules", "src", "theme-default", "yzh-theme", "dist", "essay"];
const ignoreFiles = ["index.md"];
const ignoreSidebarDirs = ["me"];
const previewCtnLeng = 25;

interface DirStateWithLink {
  text: string;
  link: string;
  activeMatch?: string;
  preview?: string;
  createTime?: string;
}

interface DirStateItemsChildren {
  text: string;
  items: DirStateWithLink[];
}

interface DirStateItems {
  text: string;
  items: (DirStateItemsChildren | DirStateWithLink)[];
}

function newDirStateWithLink(text?: string, link?: string): DirStateWithLink {
  return {
    text: text ?? "",
    link: link ?? "",
    activeMatch: link,
  };
}
function newDirStateItemsChildren(text?: string): DirStateItemsChildren {
  return {
    text: text ?? "",
    items: [],
  };
}

export type DirState = DirStateWithLink | DirStateItems;

/**
 * 返回当前目录下的 DirState
 * @param dirName
 * @returns
 */
export function resolveNavState(
  dirName: string
): DirState | DirStateItemsChildren {
  let dirFss = fs
    .readdirSync(dirName)
    .filter(
      (dirFs) =>
        fs.statSync(`${dirName}/${dirFs}`).isDirectory() &&
        !dirFs.startsWith(".") &&
        ignoreDirs.indexOf(dirFs) == -1
    );

  let state: DirState;

  console.log('dirName:', dirName)

  const dirVars = require(`../${dirName}/index.ts`);
  let text: string = dirVars.__DIR__NAME__;

  if (dirFss.length > 0) {
    state = newDirStateItemsChildren(text);
    for (const dir of dirFss) {
      state.items.push(
        resolveNavState(`${dirName}/${dir}`) as DirStateItemsChildren
      );
    }
  } else {
    state = newDirStateWithLink(text, `/${dirName}/`);
  }

  return state;
}

export function resolveSidebar(dirStates: DirState[]): any {
  const retState = {};

  let flatedStates = flatDirStates(dirStates);
  flatedStates = flatedStates.filter(
    (dirState) => ignoreSidebarDirs.indexOf(dirState.link.slice(1, -1)) == -1
  );

  for (const dirState of flatedStates) {
    retState[dirState.link] = [
      {
        text: dirState.text,
        items: resolveDirFiles(`.${dirState.link.slice(0, -1)}`),
      },
    ];
  }

  return retState;
}

function flatDirStates(dirStates: DirState[]): DirStateWithLink[] {
  const ret: DirStateWithLink[] = [];

  for (const state of dirStates) {
    if (state["link"] == undefined) {
      ret.push(...flatDirStates(state["items"]));
    } else {
      ret.push(state as DirStateWithLink);
    }
  }
  return ret;
}

/**
 * 解析一个目录下所有有效文件
 */
function resolveDirFiles(dirPath: string): DirStateWithLink[] {
  const ret: DirStateWithLink[] = [];

  const files = fs
    .readdirSync(dirPath)
    .filter(
      (fileName) =>
        !fileName.startsWith(".") &&
        fileName.endsWith(".md") &&
        fs.statSync(`${dirPath}/${fileName}`).isFile() &&
        ignoreFiles.indexOf(fileName) == -1
    );

  for (const f of files) {
    const filename = `${dirPath}/${f}`;
    const content = fs.readFileSync(filename, "utf8");

    const fm = resolveFrontMatter(content);
    if (fm == null) {
      console.error(
        `ERR: ${filename} is not stated with '---', must have front-matter!!!`
      );
      continue;
    }
    if (!fm.preview) {
      console.error(
        `ERR: ${filename} dose not have front-matter: 'preview' !!!`
      );
      fm.preview = "暂无预览内容";
    }
    if (!fm.createTime) {
      const createTime = fs.statSync(filename).ctime.toLocaleDateString();

      const replaceStr =
        fm.originText.slice(0, -3) + `createTime: ${createTime}\n---`;
      const newCtn = content.replace(fm.originText, replaceStr);
      fs.writeFileSync(filename, newCtn);
      fm.createTime = createTime;
    }

    ret.push({
      text: fm.title as string,
      link: `${dirPath.replace(".", "")}/${f.slice(0, -3)}`,
      preview: fm.preview.slice(0, previewCtnLeng) + " ...",
      createTime: fm.createTime,
    });
  }

  ret.sort((a, b) => (a.createTime! > b.createTime! ? -1 : 1));

  return ret;
}

function resolveFrontMatter(content: string): null | any {
  let re = /---(.*?)---/gs;
  if (!content.startsWith("---")) {
    return null;
  }

  let res = re.exec(content);

  return {
    ...load(res![1]),
    originText: res![0],
  };
}
