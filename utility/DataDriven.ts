import {test} from "@playwright/test";
import path from "path";
import * as XLSX from "xlsx";

test ('Read', async()=>{

    //1. mention the path of excel
    let excelPath:string= path.join(
        process.cwd(), 
        "testData",
        "DataDriven.xlsx"
    );

    //2. Declare the column type
    type excelType={
        SNO: number;
        UserName: string;
        Emailid: string;
        PassWord: string;
        PhoneNumber: string;
        Date: string;
    }

    //3. Read the value from excel
    let workBook:XLSX.WorkBook=XLSX.readFile(excelPath);

    //4. mention the sheet
    let sheet: XLSX.WorkSheet=workBook.Sheets["Credential"];

    //5. convert to json
    let jsonData:excelType[]=XLSX.utils.sheet_to_json<excelType>(sheet);

    console.log(jsonData[1]["UserName"]);
})