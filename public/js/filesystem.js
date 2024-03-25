import {
  Directory,
} from './directory.js';

export class FileSystem {
  constructor() {
    console.log("YO NEW FILE SYSTEM YO!");
    this.root = new Directory(null, "/");
    let foo = new Directory(this.root, "foo");
    foo.AddDirectory(new Directory(foo, "bar"));
    this.root.AddDirectory(foo);
  }

  ListContents() {
    return this.root.ListContents();
    // let dirHandle = GetHandle(dir);
    //if (dirHandle) {
    //  return dirHandle.ListContents();
    //}
    //return null;
  }

  GetHandle(dirname) {
    return "/foo/bar";
  }

}
