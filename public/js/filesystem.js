import {
  Directory,
} from './directory.js';

import {
  Environment,
} from './environment.js';

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
    home.AddSubDirectory(new Directory(home, "willy"));
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
    let curdir = this.root;
    path = path.slice(1);
    const dirnames = path.split('/');
    dirnames.every((d) => {
      if (d === '.') return true;
      if (d === '..') {
        curdir = curdir.GetParent();
        return true;
      }
      let sd = curdir.subdirs.get(d);
      if (!sd) return false;
      curdir = sd;
      return true;
    });
    return curdir;
  }
}
