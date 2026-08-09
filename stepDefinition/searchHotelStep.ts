import { Given, When, Then, Before } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { baseClass } from "./hooks.js";
import { SearchHotelPage } from "../pages/searchHotel.js";

let searchHotelPage: SearchHotelPage;

Before(async function () {
  searchHotelPage = new SearchHotelPage(baseClass.page);
});

Given('the user is on the Adactin Search Hotel page', async function () {
  await baseClass.enterAppURL("https://adactinhotelapp.com/SearchHotel.php");
  await baseClass.verifyURL("https://adactinhotelapp.com/SearchHotel.php");
  await baseClass.waitForElement("#location");
  console.log("*** User is on the Adactin Search Hotel page ***");
});

When('the user enters the required details', async function () {
  await searchHotelPage.searchHotel(
    "Sydney",
    "Hotel Creek",
    "Standard",
    "1 - One",
    "10/10/2026",
    "12/10/2026",
    "2 - Two",
    "0 - None"
  );
  console.log("*** User has entered the required details ***");
});

When('the user clicks the Search button', async function () {
  await searchHotelPage.searchButton.click();
  console.log("*** User has clicked the Search button ***");
});

Then('the user should see the search results', async function () {
  await expect(baseClass.page).toHaveURL(/SelectHotel/);
  console.log("*** User is on the Search Results page ***");
  await baseClass.waitForLoadState("load");
});
