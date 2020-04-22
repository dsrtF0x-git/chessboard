class Stdin {
  constructor() {
    this.stdin = process.openStdin();
  }

  init() {
    console.log("init >>>");
    this.stdin.addListener("data", (text) => {
      const name = text.toString().trim();
      console.log("Name >>>", name);
    });
  }

  write(value) {
    console.log("write >>>", value);
    process.stdout.write(value);
  }

  pause() {
    console.log("pause >>>");
    this.stdin.pause();
  }
}

export { Stdin };
