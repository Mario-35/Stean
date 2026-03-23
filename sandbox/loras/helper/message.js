function message(title) {
    return title ? `\x1b[36m${"=".repeat(25)} ${title} ${"=".repeat(25)}\x1b[0m` : `\x1b[31m<${"===> Error <===".repeat(5)}>\x1b[0m`;
  }

  module.exports = message;