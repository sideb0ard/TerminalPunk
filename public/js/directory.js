export class Directory {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
    this.subdirs = [];
  }

  Name() {
    return this.name;
  }

  AddDirectory(dir) {
    this.subdirs.push(dir);
  }

  HasSubDirectory(dirname) {
    this.subdirs.forEach((d) => {
      if (d.Name() === dirname) return true;
    });
    return false;
  }

  ListContents() {
    // let reply = [".", ".."];
    let reply = [];
    this.subdirs.forEach((sd) => {
      reply.push(sd.name);
      //  reply.push(sd.ListContents());
    });
    return reply;
  }

}
