import { BeforeAll, AfterAll, After, setDefaultTimeout, Status } from "@cucumber/cucumber";
import BaseClass from "../utility/BaseClass.js";

export const baseClass = new BaseClass();

setDefaultTimeout(30000);

BeforeAll(async function () {
  await baseClass.browserLaunch();
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const fileName = `failed-${Date.now()}`;
    await baseClass.takeScreenShot(fileName);

    const buffer = await baseClass.page.screenshot();
    await this.attach(buffer, "image/png");
  }
});

AfterAll(async function () {
  await baseClass.closeBrowser();
});
