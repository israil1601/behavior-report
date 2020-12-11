import { RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { Context } from "../../deps.ts";
import {
  headerState,
  isEmpty,
  validateEveningReport,
  validateMorningReport,
} from "../../services/helpers.ts";
import {
  getLastWeekSum,
  getSummaryDate,
  postEveningReport,
  postMorningReport,
} from "../../services/service.ts";

const setMorningReport = async ({
  request,
  response,
  session,
  render,
}: RouterContext) => {
  const body = request.body();
  const content = await body.value;

  const date = content.get("date");
  const sleep_duration = content.get("sleep_duration") ? +content.get("sleep_duration") : null;
  const sleep_quality = +content.get("sleep_quality");
  const generic_mood = +content.get("generic_mood");
  const data = {
    sleep_duration,
    sleep_quality,
    generic_mood,
    date,
  };
  const errors = await validateMorningReport(data);

  if (!isEmpty(errors)) {
    render("views/morning.ejs", {
      ...(await headerState(session)),
      ...data,
      errors,
      isDone: false,
      date: new Date().toJSON().slice(0, 10),
    });

    return;
  }

  const { id } = await session.get("user");

  await postMorningReport(
    sleep_duration,
    sleep_quality,
    generic_mood,
    date,
    id
  );

  response.redirect("/");
};

const setEveningReport = async ({
  request,
  response,
  session,
  render,
}: RouterContext) => {
  const body = request.body();
  const content = await body.value;

  const date = content.get("date");

  // if not set, do not convert from null to zero
  const sports_duration = content.get("sports_duration")
    ? +content.get("sports_duration")
    : null;
  const study_duration = content.get("study_duration")
    ? +content.get("study_duration")
    : null;

  const eating_quality = +content.get("eating_quality");
  const generic_mood = +content.get("generic_mood");
  const data = {
    sports_duration,
    study_duration,
    eating_quality,
    generic_mood,
    date,
  };

  const errors = await validateEveningReport(data);
  if (!isEmpty(errors)) {
    render("views/evening.ejs", {
      ...(await headerState(session)),
      ...data,
      errors,
      isDone: false,
      date: new Date().toJSON().slice(0, 10),
    });

    return;
  }

  const { id } = await session.get("user");

  await postEveningReport(
    sports_duration,
    study_duration,
    eating_quality,
    generic_mood,
    date,
    id
  );
  response.redirect("/");
};

const setSummaryWeek = async ({ request, response }: Context) => {
  const body = request.body();
  const content = await body.value;

  const [year, week] = content.get("week").split("-");
  response.redirect(`/behavior/summary/weekly?w=${+week.slice(1)}&y=${year}`);
};

const setSummaryMonth = async ({ request, response }: Context) => {
  const body = request.body();
  const content = await body.value;

  const [year, month] = content.get("month").split("-");
  response.redirect(`/behavior/summary/monthly?m=${+month}&y=${year}`);
};

const getLastWeekAverage = async ({ response }: Context) => {
  const summary = await getLastWeekSum();

  response.body = summary;
};

const getDayAverage = async ({ params, response }: RouterContext) => {
  const { year, month, day } = params;
  const summary = await getSummaryDate(`${year}-${month}-${day}`);

  response.body = summary;
};

export {
  setMorningReport,
  setEveningReport,
  setSummaryWeek,
  setSummaryMonth,
  getLastWeekAverage,
  getDayAverage,
};
