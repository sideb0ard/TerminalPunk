import {
  Directory,
  File,
} from './directory.js';

import {
  Environment,
} from './environment.js';

const READMETXT_contents = "You are an agent of BCPL - the Bureau for the Containment of Programmatic Lifeforms. Your mission is to track down a rogue AI named Matt Daemon who is loose on this file system. You need to solve several tasks, each of which will get you part of the decryption key required to enter the home directory of Matt Daemon. Start with /lib!";

export class FileSystem {
  constructor() {
    console.log("YO NEW FILE SYSTEM YO!");
    this.root = new Directory(null, "/");
    let foo = new Directory(this.root, "foo");
    foo.AddSubDirectory(new Directory(foo, "bar"));
    this.root.AddSubDirectory(foo);
    this.root.AddSubDirectory(new Directory(this.root, "bin"));
    this.root.AddSubDirectory(new Directory(this.root, "etc"));
    this.root.AddSubDirectory(new Directory(this.root, "dev"));
    let home = new Directory(this.root, "home");
    console.log("HOME:", home);
    let agent_home = new Directory(home, "agent");
    let READMETXT = new File("README.txt");
    READMETXT.SetContents(READMETXT_contents);
    agent_home.AddFile(READMETXT);
    home.AddSubDirectory(agent_home);
    home.AddSubDirectory(new Directory(home, "mdaemon"));
    this.root.AddSubDirectory(home);
    this.root.AddSubDirectory(new Directory(this.root, "var"));
    this.root.AddSubDirectory(new Directory(this.root, "lib", "THE_LIBRARY"));
  }

  GetDir(dirname) {
    let dirHandle = this.GetHandle(dirname);
    if (dirHandle) {
      return dirHandle;
    }
  }

  GetDirPath(dirname) {
    let dirHandle = this.GetHandle(dirname);
    if (dirHandle) {
      return dirHandle.GetFullPath();
    }
  }

  CatFile(filename) {
    if (!filename) {
      console.log("ERRoR - nae filename!");
      return null;
    }
    let fileHandle = this.GetHandle(filename);
    if (fileHandle) {
      return fileHandle.GetContents();
    }
    return null;
  }

  ListContents(dirname) {
    if (!dirname) {
      console.log("ERRoR - nae dirname!");
      return null;
    }
    let dirHandle = this.GetHandle(dirname);
    if (dirHandle) {
      return dirHandle.ListContents();
    }
    return null;
  }

  GetHandle(path) {
    if (path.length == 1 && path.match(/^\/$/)) {
      return this.root;
    }
    let cur_handle = this.root;
    path = path.slice(1);
    const dirnames = path.split('/');
    dirnames.every((d) => {
      if (d === '.') return true;
      if (d === '..') {
        cur_handle = cur_handle.GetParent();
        return true;
      }
      let fh = cur_handle.subdirs.get(d);
      if (!fh) {
        fh = cur_handle.files.get(d);
        if (!fh) {
          return false;
        }
      }
      cur_handle = fh;
      return true;
    });
    return cur_handle;
  }
}
