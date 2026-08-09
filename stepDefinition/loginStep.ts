import { Given, When, Then, Before } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { baseClass } from "./hooks.js";
import { LoginPage } from "../pages/login.js";

let loginPage: LoginPage;

Before(async function() {
  loginPage = new LoginPage(baseClass.page);
  await baseClass.waitForLoadState("load");
});

Given('the user is on the Adactin Login page', async function () {
 
  await baseClass.enterAppURL("https://adactinhotelapp.com/");
  await baseClass.verifyURL("https://adactinhotelapp.com/");
  await baseClass.verifyTitle("Adactin.com - Hotel Reservation System");
  await baseClass.waitForElement("//input[@name='username']");

});

When('the user enters {string} and {string}', async function (username:string, password:string){
  
  await loginPage.login(username, password);
  console.log(await baseClass.textContentElement("//input[@name='username']"));
  console.log(await baseClass.textContentElement("//input[@name='password']"));
  
  
});

When('the user clicks the Login button', async function () {
 await baseClass.waitForElement("//input[@name='login']");
 await loginPage.clickLogin();
});

Then('the user should see {string}', async function (result:string){
  if(result === "Login successful"){
    await baseClass.waitForLoadState("load");
    await expect(baseClass.page).toHaveURL(/SearchHotel/);
    console.log("*** Login successful ***");
  }
  else if(result === "Login failed message"){
    const errorMessage = baseClass.page.locator("//span[@id='login_error']");
    await expect(errorMessage).toBeVisible();
  }
});