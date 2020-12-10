import { Context } from "../../deps.ts";
import { postEveningReport, postMorningReport } from '../../services/service.ts';

const setMorningReport = async ({request, response}: Context) => {
    const body = request.body();
    const content = await body.value;
    
    const date = content.get("date");
    const sleepDuration = +content.get("sleep_duration");
    const sleepQuality = +content.get("sleep_quality");
    const genericMood = +content.get("generic_mood");
    
    await postMorningReport(sleepDuration, sleepQuality, genericMood, date, 1);
    
    response.redirect("/");
}

const setEveningReport = async({ request, response }: Context) => {
    const body = request.body();
    const content = await body.value;
    
    const date = content.get("date");
    const sportsDuration = +content.get("sports_duration");
    const studyDuration = +content.get("study_duration");
    const eatingQuality = +content.get("eating_quality");
    const genericMood = +content.get("generic_mood");
    
    await postEveningReport(sportsDuration, studyDuration, eatingQuality, genericMood, date, 1);
    response.redirect("/");
}

const setSummaryWeek = async ({request, response}: Context) => {
    const body = request.body();
    const content = await body.value;
    
    const [year, week] = content.get('week').split('-');
    response.redirect(`/behavior/summary/weekly?w=${+week.slice(1)}&y=${year}`);
}

const setSummaryMonth = async ({request, response}: Context) => {
    const body = request.body();
    const content = await body.value;

    const [year, month] = content.get('month').split('-');
    response.redirect(`/behavior/summary/monthly?m=${+month}&y=${year}`);
}


export {setMorningReport, setEveningReport, setSummaryWeek, setSummaryMonth}