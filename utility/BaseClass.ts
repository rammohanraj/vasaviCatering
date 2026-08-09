import { chromium, Browser, BrowserContext, Page, Locator, FrameLocator } from "@playwright/test";
import { expect } from "@playwright/test";
//file read
import fs from "fs/promises";
import path from "path";

export default class BaseClass {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

// Read a text file
async readFileText(relOrAbsPath: string): Promise<string> {
  const filePath = path.isAbsolute(relOrAbsPath)
    ? relOrAbsPath
    : path.join(process.cwd(), relOrAbsPath);

  return await fs.readFile(filePath, { encoding: "utf-8" });
}

// Read a JSON file and parse it
async readJSON<T = any>(relOrAbsPath: string): Promise<T> {
  const text = await this.readFileText(relOrAbsPath);
  return JSON.parse(text) as T;
}



    async browserLaunch():Promise<void>{
        this.browser=await chromium.launch({headless:false,args: ["--start-maximized"]});
        this.context=await this.browser.newContext({ viewport: null });
        this.page=await this.context.newPage();
        console.log("**********browser launch successfully**********");

    }

    async enterAppURL(url:string):Promise<void>{
        await this.page.goto(url);
    }

    async getApplicationTitle():Promise<string>{
        let title:string= await this.page.title()
        return title;
    }
    
    async fillElement(selector:string,value:string){
        await this.page.locator(selector).fill(value);
    }

    async clickElement(selector:string){
        await this.page.locator(selector).waitFor({state:"visible"});
        await this.page.locator(selector).click();
    }
    
    async staticWait(milliSeconds: number){
         await this.page.waitForTimeout(milliSeconds);
    }
    
    async waitForLoadState(state: "load" | "domcontentloaded" | "networkidle"){
        await this.page.waitForLoadState(state);
    }

    getLocator(selector:string):Locator{
      return this.page.locator(selector);
    }

 //gettextcontent
    async textContentElement(selector:string):Promise<string|null>{
      await this.page.locator(selector).waitFor({state:"visible"});
        return this.page.locator(selector).textContent();
    }

//getinput the value
    inputValueElement(selector:string):Promise<string>{
        return this.getLocator(selector).inputValue();
    }
 
//getattribute the value
    getAttributeValue(selector:string, attributeName:string):Promise<string|null>{
        return this.getLocator(selector).getAttribute(attributeName);
    }

//mouse hover
    async hoverElement(selector:string){ 
      await this.getLocator(selector).waitFor({state:"visible"});
      await this.getLocator(selector).hover();
    }

 //drag and drop
    async dragAndDrop(sourceSelector:string,targetSelector:string){
await this.getLocator(sourceSelector).dragTo(this.getLocator(targetSelector));
    }

//right click
    async rightClick(selector:string){
       await this.getLocator(selector).waitFor({state:"visible"});
       await this.getLocator(selector).click({button:"right"});
    }

//double click
    async doubleClick(selector:string){
       await this.getLocator(selector).waitFor({state:"visible"});
       await this.getLocator(selector).dblclick();
    }
//verify accept the alert
  async acceptAlert():Promise<void>{
        this.page.once("dialog", async(dialog)=>{
            console.log(dialog.message());
             await dialog.accept();
        });
    }

//verify dismiss the alert
    async dismissAlert():Promise<void>{
        this.page.once("dialog", async(dialog)=>{
            console.log(dialog.message());
             await dialog.dismiss();
        });
    }

//verify accept the alert and enter the message
 async enterPrompt(text:string):Promise<void>{
        this.page.once("dialog", async(dialog)=>{
        console.log(dialog.message());
    await dialog.accept(text);
        });
    }

//get alert message
async getAlertMessage(): Promise<string> {
    return new Promise((resolve) => {
        this.page.once("dialog", async (dialog) => {
            const message = dialog.message();
            await dialog.accept();
            resolve(message);
        });
    });
}

//handle all type of alert
async handleAlert(action: "accept" | "dismiss", promptText?: string):Promise<void> {
    this.page.once("dialog", async(dialog) => {
        console.log(`Type: ${dialog.type()}`);
        console.log(`Message: ${dialog.message()}`);

        if (action === "accept") {
            await dialog.accept(promptText);
        } else {
            await dialog.dismiss();
        }
    });
}

async handelAlert(action: "accept" | "dismiss", promptText?: string):Promise<void> {
    return this.handleAlert(action, promptText);
}

//take screen shot
   async takeScreenShot(fileName:string):Promise<void>{
        await this.page.waitForLoadState("load");
        await this.page.screenshot({path : `screenshots/${fileName}.png`});
       //await this.page.waitForTimeout(3000);
    }
   
//take screen shot entire screen
   async takeEntireScreenShot(fileName: string): Promise<void> {
    await this.page.screenshot({
        path: `screenshots/${fileName}.png`, fullPage: true});
    await this.page.waitForTimeout(3000);
}

//take particulat element screen shot
 async takeScreenShotForParticularElement(selector: string, fileName: string): Promise<void> {
    await this.getLocator(selector).screenshot({path : `screenshots/${fileName}.png`});
    await this.page.waitForTimeout(3000);

      }
//drop down using index 
 async selectDropDownUsingIndex(selector:string, index:number):Promise<void>{
        await this.page.locator(selector).selectOption({index});
      }
 //drop down using value
  async selectDropDownUsingValue(selector:string, value:string):Promise<void>{
        await this.page.locator(selector).selectOption({value});
      }
 //drop down using visible text
    async selectDropDownUsingVisibleText(selector:string, label:string):Promise<void>{
       await this.page.locator(selector).selectOption({label})
      }

 //browser close
 async closeBrowser(): Promise<void> {
    await this.browser.close();
      }
 //keyboard methods
 async pressKey(selector:string, key:string):Promise<void>{
    await this.getLocator(selector).press(key);
 }

 async keyboardPress(key:string):Promise<void>{
    await this.page.keyboard.press(key);
 }

 async keyBoardPress(key:string):Promise<void>{
    return this.keyboardPress(key);
 }
 
 //check box methods
 async checkBox(selector:string):Promise<void>{
    await this.getLocator(selector).check();
 }

 //uncheck the check box
 async unCheckBox(selector:string):Promise<void>{
    await this.getLocator(selector).uncheck();
 }

 //check box is checked or not
 async isChecked(selector:string):Promise<boolean>{
    return await this.getLocator(selector).isChecked();
 }

 //radio button
 async radioButton(selector:string):Promise<void>{
    await this.getLocator(selector).check();
 }

 //file upload
 async fileUpload(selector:string, filePath:string):Promise<void>{
    await this.getLocator(selector).setInputFiles(filePath);
 }

//get Frame
getFrame(frameName:string): FrameLocator {
    return this.page.frameLocator(frameName);
}

//scroll into element
async scrollIntoView(selector:string): Promise<void>{
   await this.getLocator(selector).scrollIntoViewIfNeeded();
}

//get current url
getCurrentURL():string{
    return this.page.url();
}

//reload page
async reloadPage():Promise<void>{
   await this.page.reload();
}

//navigate to Back
async goBack():Promise<void>{
  await this.page.goBack();
}

//navigate to Forward
async goForward():Promise<void>{
  await this.page.goForward();
}

//Assertions
async verifyTitle(expected:string):Promise<void>{
    await expect(this.page).toHaveTitle(expected);
}

//clear Text
async clearText(selector:string):Promise<void>{
    await this.getLocator(selector).fill("");
}

//Append Text
async appendText(selector: string, value: string): Promise<void> {
    await this.getLocator(selector).type(value);
}

//get Element Text from HTML
async getText(selector:string):Promise<string>{
   return (await this.getLocator(selector).innerText()).trim();
}

//get Element All Text from HTML
async getAllText(selector:string):Promise<string[]>{
    return await this.getLocator(selector).allInnerTexts();
}

//Element Count --> useful for webTables
async getElementCount(selector:string):Promise<number>{
    return await this.getLocator(selector).count();
}

//check Visibility
async isVisible(selector:string):Promise<boolean>{
return await this.getLocator(selector).isVisible();
}

//check Enabled
async isEnabled(selector:string):Promise<boolean>{
    return await this.getLocator(selector).isEnabled();
}

//check Disabled
async isDisabled(selector:string):Promise<boolean>{
    return await this.getLocator(selector).isDisabled();
}

//check isHidden
async isHidden(selector:string):Promise<boolean>{
    return await this.getLocator(selector).isHidden();
}

//Wait For Element
async waitForElement(selector:string):Promise<void>{
    await this.getLocator(selector).waitFor({state:"visible"});
}

//wait For Element Hidden
async waitForElementHidden(selector:string):Promise<void>{
    await this.getLocator(selector).waitFor({state:"hidden"});
}

//javascript click
async JSClick(selector:string):Promise<void>{
   await this.getLocator(selector).evaluate((element:HTMLElement)=>element.click());
}

//javascript Fill
async JSFill(selector:string, value:string):Promise<void>{
    await this.getLocator(selector).evaluate((element:HTMLInputElement,text)=>{
    element.value=text;
    },
    value);
}

//Focus Element
async focusElement(selector:string):Promise<void>{
    await this.getLocator(selector).focus();
}

//Select All Text
async selectAllText():Promise<void>{
    await this.page.keyboard.press("Control+A");
}

//Copy The Text
async Copy():Promise<void>{
    await this.page.keyboard.press("Control+C");
}

//Copy the Text
async paste(): Promise<void> {
    await this.page.keyboard.press("Control+V");
}

//Download File
async downloadFile(selector: string): Promise<string> {

    const downloadPromise = this.page.waitForEvent("download");

    await this.clickElement(selector);

    const download = await downloadPromise;

    return await download.path() ?? "";
}

//New Tab
async switchToNewTab(): Promise<Page> {

    const pagePromise = this.context.waitForEvent("page");

    const newPage = await pagePromise;

    await newPage.waitForLoadState();

    return newPage;
}

//Close Alert and Return Text
async acceptAlertAndGetText(): Promise<string> {

    return new Promise((resolve) => {

        this.page.once("dialog", async dialog => {

            const text = dialog.message();

            await dialog.accept();

            resolve(text);

        });

    });

}

//Verify URL
async verifyURL(expected:string):Promise<void>{
   await expect(this.page).toHaveURL(expected);
}

//Verify Text
async verifyText(selector:string, expected:string):Promise<void>{
   await expect(this.getLocator(selector)).toHaveText(expected);
}

//Verify Visibility
async verifyVisibility(selector:string):Promise<void>{
    await expect(this.getLocator(selector)).toBeVisible();
 }

//Verify Enabled
async verifyEnabled(selector:string):Promise<void>{
    await expect(this.getLocator(selector)).toBeEnabled();
}

//Verify Checked
async verifyChecked(selector: string): Promise<void> {
    await expect(this.getLocator(selector)).toBeChecked();
}

//Mouse Wheel Scroll 
async scrollDown(): Promise<void> {
    await this.page.mouse.wheel(0, 1000);
}

//Scroll To Top
async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
}

 }