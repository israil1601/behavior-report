import { Context, RouterContext } from "../../deps.ts";

import {
  getLastWeekSum,
  getSummaryDate,
} from "../../services/summaryService.ts";

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

export { setSummaryWeek, setSummaryMonth, getLastWeekAverage, getDayAverage };
