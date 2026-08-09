// page object module
import{Locator,Page} from "@playwright/test";

export class LoginPage{
 readonly page:Page;
 readonly txtEmailId:Locator;
 readonly txtPassword:Locator;
 readonly btnLogin:Locator;

 constructor(page:Page){

  this.page=page;

  this.txtEmailId=this.page.locator("#username");
  this.txtPassword=this.page.locator("#password");
  this.btnLogin=this.page.locator("#login");
 }

 async login(emailId:string, password:string): Promise<void>{
    await this.txtEmailId.waitFor({ state: "visible" });
    await this.txtPassword.waitFor({ state: "visible" });

    await this.txtEmailId.fill(emailId);
    await this.txtPassword.fill(password);
    
}

 async clickLogin(): Promise<void> {
  await this.btnLogin.click();
}

}