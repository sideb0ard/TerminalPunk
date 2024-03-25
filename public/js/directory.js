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

  ListContents() {
    // let reply = [".", ".."];
    let reply = [];
    this.subDirs.forEach((sd) => {
      reply.push(sd.name);
      //  reply.push(sd.ListContents());
    });
    return reply;
  }

}
