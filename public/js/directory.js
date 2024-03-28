export class Directory {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
    this.subdirs = new Map();
  }

  Name() {
    return this.name;
  }

  AddSubDirectory(dir) {
    console.log("YO IM ", this.name, "add SUBDIR ", dir);
    this.subdirs.set(dir.Name(), dir);
  }

  GetSubDirectory(dirname) {
    console.log("YO IM ", this.name, "GET SUBDIR ", dirname);
    return this.subdirs.get(dirname);
  }

  ListContents() {
    console.log("YO IM ", this.name, "CALL LIS CONTX", this.subdirs);
    console.log("KEYSZZ:", this.subdirs.keys());
    let reply = [];
    this.subdirs.forEach((value, key) => {
      reply.push(key);
    });
    return reply;
  }

}
