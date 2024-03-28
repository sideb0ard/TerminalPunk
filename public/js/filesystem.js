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
  }

  ListContents(dirname) {
    if (!dirname.startsWith('/')) {
      console.log("ERROR - need full path, but you passed in:", path);
      return null;
    }
    console.log("FS LIST CONTENTS _:", dirname);
    let dirHandle = this.GetHandle(dirname);
    console.log("HERS MY HANDLE:", dirHandle);
    if (dirHandle) {
      console.log("GOT A HANDLE - CLLING LIST CONTENTS");
      return dirHandle.ListContents();
    }
    return null;
  }

  GetHandle(path) {
    if (!path.startsWith('/')) {
      console.log("ERROR - need full path, but you passed in:", path);
      return null;
    }
    if (path.length == 1) {
      return this.root;
    }
    let curdir = this.root;
    console.log("CUR:", curdir);
    path = path.slice(1);
    const dirnames = path.split('/');
    dirnames.every((d) => {
      let sd = curdir.subdirs.get(d);
      if (!sd) return false;
      curdir = sd;
      return true;
    });
    if (curdir.Name() == dirnames.slice(-1)) {
      console.log("FOUND IT - ", curdir.Name());
      return curdir;
    }
    console.log("DIDNT FIND IT!");
    return null;
  }
}
