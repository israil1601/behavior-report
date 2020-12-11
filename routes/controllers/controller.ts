import { Context, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { getWeek, headerState } from "../../services/helpers.ts";
import {
  getEveningReport,
  getMorningReport,
  getSummaryWeek,
  getSummaryMonth,
  getAverageMood,
} from "../../services/service.ts";

const morningReport = async ({ render, session }: Context) => {
  const date = new Date().toJSON().slice(0, 10);
  const data = { ...(await headerState(session)), date, isDone: false };
  const { id } = await session.get("user");
  const res = await getMorningReport(+id, date);

  if (res.length) data.isDone = true;

  render("views/morning.ejs", data);
};

const eveningReport = async ({ render, session }: Context) => {
  const date = new Date().toJSON().slice(0, 10);
  const data = { date, isDone: false, ...(await headerState(session)) };
  const { id } = await session.get("user");

  const res = await getEveningReport(+id, date);
  if (res.length) data.isDone = true;

  render("views/evening.ejs", data);
};

const showSummaryWeek = async ({ render, request, session }: RouterContext) => {
  const params = request.url.searchParams;
  const currentDate = new Date();
  const week = params.has("w") ? +params.get("w") : getWeek(currentDate);
  const year = params.has("y") ? +params.get("y") : currentDate.getFullYear();
  const { id } = await session.get("user");

  const summary = await getSummaryWeek(+id, week, year);
  const data = {
    type: "week",
    year,
    summary,
    number: week,
    ...(await headerState(session)),
  };

  render("views/summary.ejs", data);
};

const showSummaryMonth = async ({
  render,
  request,
  session,
}: RouterContext) => {
  const params = request.url.searchParams;
  const currentDate = new Date();
  const month = params.has("m") ? +params.get("m") : currentDate.getMonth() + 1;
  const year = params.has("y") ? +params.get("y") : currentDate.getFullYear();
  const { id } = await session.get("user");

  const summary = await getSummaryMonth(+id, month, year);

  const data = {
    type: "month",
    year,
    summary,
    number: month,
    ...(await headerState(session)),
  };
  render("views/summary.ejs", data);
};

const showLandingPage = async ({ render, session }: RouterContext) => {
  const data = {
    average_mood_today: 0,
    average_mood_yesterday: 0,
    mood: "",
    ...(await headerState(session)),
  };

  const averageMood = await getAverageMood();
  if (averageMood.length < 2) {
    render("views/index.ejs", data);
    return;
  }

  const todayAvg = averageMood[0].average;
  const yesterdayAvg = averageMood[1].average;
  data.average_mood_today = todayAvg;
  data.average_mood_yesterday = yesterdayAvg;
  data.mood = todayAvg >= yesterdayAvg ? "bright" : "gloomy";
  render("views/index.ejs", data);
};

export {
  morningReport,
  eveningReport,
  showSummaryWeek,
  showSummaryMonth,
  showLandingPage,
};
