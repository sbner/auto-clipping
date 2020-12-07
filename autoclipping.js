console.time();
/*
Título Notícia 1 -> /html/body/div/div/table/tbody/tr[11]/td/p/span[1]/span
Resumo Notícia 1 -> /html/body/div/div/table/tbody/tr[11]/td/p/span[2]/span
Link Notícia 1 -> /html/body/div/div/table/tbody/tr[11]/td/p/strong/span[1]/a

A primeira notícia sempre começará com "tr[11]" e as próximas serão os números impares subsequentes.
*/

const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'http://www.autohonda.net/informativos/dez7_2020.htm';
const newsNumber = 5;

//removes the \n , \t and double spaces from string
cleanString = (string) => {
    return string.replace(/\s{2,}|[\n\t]/g,'');
}

whatDayIsToday = () => {
    d = new Date();
    let result = `${d.getDate()}.` + `${d.getMonth() + 1}.` + `${d.getFullYear()}`;
    return result;
}

async function makeClippingWpp(url,newsNumber) {
    let count = 0;
    let clippingNews = [];
    let clippingHeader = "```Clipping Diário " + whatDayIsToday() + "```" + "\n";
    let clippingEnding = "Qualquer erro, sugestão ou dúvida por favor mandar email para matheus@autohonda.net" + "\n";

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    console.log(clippingHeader);

    while (count < newsNumber) {

        let [el] = await page.$x(`/html/body/div/div/table/tbody/tr[${11+2*count}]/td/p/span[1]/span`);
        let title = await el.getProperty('textContent');
        let rawTitle = await title.jsonValue();
        let cleanTitle = await cleanString(rawTitle);

        let [el2] = await page.$x(`/html/body/div/div/table/tbody/tr[${11+2*count}]/td/p/span[2]/span`);
        let summary = await el2.getProperty('textContent');
        let rawSummary = await summary.jsonValue();
        let cleanSummary = await cleanString(rawSummary);

        let [el3] = await page.$x(`/html/body/div/div/table/tbody/tr[${11+2*count}]/td/p/strong/span[1]/a`);
        let href = await el3.getProperty('href');
        let hrefTxt = await href.jsonValue();

        //Além de organizar as notícias, adiciona formatação das notícias para o wpp
        clippingNews[count] = await "*" + cleanTitle + "*" + "\n" + cleanSummary + "\n" + hrefTxt + "\n" + "---";
        
        console.log(clippingNews[count]);

        count++;
    }

    console.log(clippingEnding);
      
    await browser.close();
    console.timeEnd();
}

makeClippingWpp(url,newsNumber);