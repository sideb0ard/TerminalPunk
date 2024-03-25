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
    foo.AddDirectory(new Directory(foo, "bar"));
    this.root.AddDirectory(foo);
  }

  ListContents(dirname) {
    let full_path = dirname.startsWith('/') ? dirname : Environment.pwd + dirname;
    console.log("FS LIST CONTENTS _ FULL PATH:", full_path);
    let dirHandle = this.GetHandle(full_path);
    if (dirHandle) {
      return dirHandle.ListContents();
    }
    return null;
  }

  GetHandle(path) {
    console.log(path);
    let startdir = Environment.pwd;
    if (!path.startsWith('/')) {
      return null;
    }
    if (path.length == 1) {
      return this.root;
    }
    let curdir = this.root;
    console.log(curdir);
    path = path.slice(1);
    const dirnames = path.split('/');
    console.log(dirnames);
    dirnames.forEach((d) => {
      if (curdir.HasSubDirectory(d)) {
        curdir = d;
      } else {
        return null;
      }
    });
  }
}
