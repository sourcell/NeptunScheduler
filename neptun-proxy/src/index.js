const puppeteer = require('puppeteer');

async function fetchNeptunData(options) {

    const result = {
        subjects: [],
        courses: []
    };
    
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
                const cols = row.querySelectorAll('td');
                return {
                    title: cols[1].innerText,
                    credits: Number(cols[6].innerText),
                    neptunCode: cols[2].innerText,
                    selector: `#${row.id} > td:nth-child(2) > span`
                };
            });
    });

    const processedSubjects = [];
    for (let link of links.filter(x => options.neptunCodes.includes(x.neptunCode))) {
        if (processedSubjects.includes(link.neptunCode)) {
            continue;
        }
        console.log(`processing ${link.neptunCode} ...`);
        result.subjects.push({
            title: link.title,
            credits: link.credits
        });
        await page.click(link.selector);
        await page.waitForSelector('.ui-button-icon-primary');

        const tds = await page.evaluate(() => {
            return [...document.querySelectorAll('#Addsubject_course1_gridCourses_bodytable > tbody td')]
                .map(td => td.innerText);
        });
        const rows = [];
        for (let i = 0; i < tds.length; i += 13) {
            rows.push(tds.slice(i, i+13));
        }

        for (let row of rows) {
            const courseDto = {};
            courseDto.subjectTitle = link.title;
            courseDto.code = row[1];
            const slotsData = row[3].split('/');
            courseDto.slots = +slotsData[2] - +slotsData[0];
            courseDto.teachers = row[7];
            courseDto.fix = row[2] === 'Elmélet';
            const days = ['V', 'H', 'K', 'SZE', 'CS', 'P', 'SZO'];
            const fullTimeData = row[6];
            const timeData = fullTimeData.slice(0, fullTimeData.indexOf(' '));
            if (timeData !== '') {
                const endOfDay = timeData.indexOf(':');
                const dayCode = timeData.slice(0, endOfDay);
                courseDto.day = days.indexOf(dayCode);
                courseDto.start = processTimeStr(timeData.slice(endOfDay + 1, endOfDay + 6));
                courseDto.end = processTimeStr(timeData.slice(endOfDay + 7, endOfDay + 12));
                result.courses.push(courseDto);
            }
        }

        await page.click('.ui-button-icon-primary');
        processedSubjects.push(link.neptunCode);
    }
    
    await browser.close();
    return result;
}

function processTimeStr(timeStr) {
    const data = timeStr.split(':');
    return +data[0] * 60 + +data[1];
}






// =============
//  EXPRESS API
// =============
const app = require('express')();
const cors = require('cors');
const PORT = 3000;
const bodyParser = require('body-parser');
const json = bodyParser.json();

app.use(cors());

app.post('/', json, async (req, res) => {
    const result = await fetchNeptunData(req.body);
    res.send(result);
});
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
