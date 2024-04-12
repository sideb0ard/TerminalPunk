export class Directory {
  constructor(parent, name, action = "none") {
    this.parent = parent;
    this.name = name;
    this.subdirs = new Map();
    this.action = action;
  }

  Name() {
    return this.name;
  }

  AddSubDirectory(dir) {
    this.subdirs.set(dir.Name(), dir);
  }

  GetParent() {
    if (!this.parent) return this;
    return this.parent;
  }

  GetFullPath() {
    console.log("YO GET FULL PATH _ MA NAME IS ", this.name);
    if (this.name === '/') return this.name;
    let path = "";
    let curdir = this;
    while (true) {
      console.log("PATHPART:", path);
      path = "/" + curdir.name + path;
      if (curdir.parent.name === '/') break;
      curdir = curdir.parent;
    }
    console.log("FULLPATH:", path);
    return path;
  }

  GetSubDirectory(dirname) {
    return this.subdirs.get(dirname);
  }

  ListContents() {
    let reply = [];
    this.subdirs.forEach((value, key) => {
      reply.push(key);
    });
    return reply.sort().join(' ');
  }

}
