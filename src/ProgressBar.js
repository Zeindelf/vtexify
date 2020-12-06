const green = '\u001b[32m';
const white = '\u001b[37m';
const reset = '\u001b[0m';
const percentageVal = (total, percent) => Math.floor((total / 100) * percent);
const percentage = (current, total) => Math.floor((current * 100) / (total === 0 ? 1 : total));

class ProgressBar {
  constructor() {
    this.width = 45;
    this.stream = process.stderr;
    this.barChar = '\u2588';
  }

  render(progress) {
    this.stream.cursorTo(0);
    this.stream.write(progress);
    this.stream.clearLine(1);
  }

  bar(percent) {
    const completedWidth = percentageVal(this.width, percent);
    const remainingWidth = this.width - completedWidth;
    const completedBar = `${green}${this.barChar}`.repeat(completedWidth);
    const remainingBar = `${white}${this.barChar}`.repeat(remainingWidth);

    return completedBar + remainingBar;
  }

  run(currVal = 0, totalVal = 0, statusText = '') {
    const tVal = Math.max(totalVal, 0);
    const currentVal = Math.min(Math.max(currVal, 0), tVal);
    const percent = percentage(currentVal, tVal);
    const barString = this.bar(percent);

    this.render(`${barString}${reset} ${percent}% ${statusText}`);
  }

  stop(clear = false) {
    if (clear) {
      this.stream.cursorTo(0);
      this.stream.clearLine(1);
    } else {
      this.stream.write('\n');
    }
  }
}

module.exports = ProgressBar;
