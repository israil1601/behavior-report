import { Context, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { getWeek } from "../../services/helpers.ts";
import { getEveningReport, getMorningReport, getSummaryWeek, getSummaryMonth, getAverageMood } from "../../services/service.ts";

const morningReport = async ({render}: Context) => {
    const date = new Date().toJSON().slice(0, 10);
    const data = {date, isDone: false}

    const res = await getMorningReport(1, date);

    if (res.length)
        data.isDone = true;
 
    render("views/morning.ejs", data);
}

const eveningReport = async ({render}: Context) => {
    const date = new Date().toJSON().slice(0, 10);
    const data = {date, isDone: false}

    const res = await getEveningReport(1, date);
    if (res.length)
        data.isDone = true;

     render("views/evening.ejs", data)
}

const showSummaryWeek = async ({render, request}: RouterContext) => {
    const params = request.url.searchParams;
    const currentDate = new Date();
    const week = params.has('w') ? +params.get('w') : getWeek(currentDate);
    const year = params.has('y') ? +params.get('y') : currentDate.getFullYear();

    const summary = await getSummaryWeek(1, week, year);
    const data = {
        type: 'week',
        year,
        summary,
        number: week
    }
    render("views/summary.ejs", data);
}

const showSummaryMonth = async ({render, request}: RouterContext) => {
    const params = request.url.searchParams;
    const currentDate = new Date();
    const month = params.has('m') ? +params.get('m') : currentDate.getMonth() + 1;
    const year = params.has('y') ? +params.get('y') : currentDate.getFullYear();
    const summary = await getSummaryMonth(1, month, year);
    
    const data = {
        type: 'month',
        year,
        summary,
        number: month
    }
    render("views/summary.ejs", data);
}

const showLandingPage = async ({render}: RouterContext) => {
    const data = {
        average_mood_today: 0,
        average_mood_yesterday: 0,
        mood: ''
    };
    
    const averageMood = await getAverageMood();
    if (averageMood.length < 2) {
        render('views/index.ejs', data);
        return;
    }
    const todayAvg = averageMood[0].average;
    const yesterdayAvg = averageMood[1].average;
    data.average_mood_today = todayAvg;
    data.average_mood_yesterday = yesterdayAvg;
    data.mood = todayAvg >= yesterdayAvg ? 'bright' : 'gloomy';
    render('views/index.ejs', data);
}


export {morningReport, eveningReport, showSummaryWeek, showSummaryMonth, showLandingPage};
