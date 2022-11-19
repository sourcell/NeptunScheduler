const puppeteer = require('puppeteer');

async function pup(options) {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // LOGIN
    console.log('logging in...');
    await page.goto('https://neptun.uni-obuda.hu/hallgato/login.aspx');
    await page.type('#user', options.username);
    await page.type('#pwd', options.password);
    await page.click('#btnSubmit');
    await page.waitForSelector('#mb1_Targyak');

    // QUERYING SUBJECTS
    console.log('querying subjects...');
    await page.goto('https://neptun.uni-obuda.hu/hallgato/main.aspx?ismenuclick=true&ctrl=0303');
    await page.waitForSelector('#upFilter_expandedsearchbutton');
    await page.click('#upFilter_expandedsearchbutton');
    await page.waitForSelector('.scrollablebody');

    // PROCESSING SUBJECTS
    console.log('processing subjects...');
    const links = await page.evaluate(() => {
        return [...document.querySelectorAll('.scrollablebody tr')]
            .map(row => {
                return {
                    neptunCode: row.querySelectorAll('td')[2].innerText,
                    selector: `#${row.id} > td:nth-child(2) > span`
                };
            });
    });
    console.log(links);

    const processedSubjects = [];

    for (let link of links.filter(x => options.neptunCodes.includes(x.neptunCode))) {
        console.log(`processing ${link.neptunCode} ...`);
        if (processedSubjects.includes(link.neptunCode)) {
            console.log(`  already processed ${link.neptunCode}, skipping`);
            continue;
        }
        await page.click(link.selector);
        await page.waitForSelector('.ui-button-icon-primary');
        await page.screenshot({
            path: `${link.neptunCode}.png`,
            fullPage: true
        });

        const courseRows = await page.evaluate(() => document.querySelectorAll('#Addsubject_course1_gridCourses_bodytable > tbody'));

        await page.click('.ui-button-icon-primary');
        processedSubjects.push(link.neptunCode);
    }
    
    await browser.close();

}






// =============
//  EXPRESS API
// =============
const app = require('express')();
const PORT = 3000;
const bodyParser = require('body-parser');
const json = bodyParser.json();

app.post('/', json, async (req, res) => {
    //console.log(req.body);
    await pup(req.body);
    res.send('ok');
});
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
