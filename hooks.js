const { Builder, By, until } = require("selenium-webdriver");
const fsp = require("fs").promises;

exports.mochaHooks = {
  beforeEach: async function () {
    // start browser
    driver = await new Builder().forBrowser("chrome").build();
    // set waits
    await driver.manage().setTimeouts({ implicit: 5000 });
  },

  afterEach: async function () {
    if (this.currentTest.state == "failed") {
      takeScreenshot(this.currentTest.title);
    }
    await driver.quit();
  },
};
async function takeScreenshot(fileName = "failedTest") {
  const image = await driver.takeScreenshot();
  await fsp.writeFile(`${fileName}.png`, image, "base64");
}
