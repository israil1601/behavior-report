import { executeQuery } from "../database/database.ts";

const getSummaryWeek = async (
  userId: number,
  weekNumber: number,
  yearNumber: number
) => {
  const res = await executeQuery(
    `
    SELECT avg(sleep_quality) as average_sleep_quality,
    avg(sleep_duration) as average_sleep_duration,
    avg(sports_duration) as average_sports_duration,
    avg(study_duration) as average_study_duration,
    avg(eating_quality) as average_eating_quality,
    avg(generic_mood_morning) as average_mood_morning,
    avg(generic_mood_evening) as average_mood_evening
    FROM reports WHERE user_id = $1 AND EXTRACT('week' FROM reported_date) = $2 AND EXTRACT('year' FROM reported_date) = $3; 
  `,
    userId,
    weekNumber,
    yearNumber
  );

  // if error || no data
  if (!res || !res.rows[0].filter((i: any) => i).length) return [];

  return res?.rowsOfObjects().map((data) => {
    const obj: any = {};
    for (let [key, value] of Object.entries(data)) {
      obj[key] = +value;
    }
    return obj;
  });
};

const getSummaryMonth = async (
  userId: number,
  monthNumber: number,
  yearNumber: number
) => {
  const res = await executeQuery(
    `
      SELECT avg(sleep_quality) as average_sleep_quality,
      avg(sleep_duration) as average_sleep_duration,
      avg(sports_duration) as average_sports_duration,
      avg(study_duration) as average_study_duration,
      avg(eating_quality) as average_eating_quality,
      avg(generic_mood_morning) as average_mood_morning,
      avg(generic_mood_evening) as average_mood_evening
      FROM reports WHERE user_id = $1 AND EXTRACT('month' FROM reported_date) = $2 AND EXTRACT('year' FROM reported_date) = $3; 
  `,
    userId,
    monthNumber,
    yearNumber
  );

  if (!res || !res.rows[0].filter((i: any) => i).length) return [];

  return res?.rowsOfObjects().map((data) => {
    const obj: any = {};
    for (let [key, value] of Object.entries(data)) {
      obj[key] = +value;
    }

    return obj;
  });
};

const getLastWeekSum = async () => {
  const res = await executeQuery(`SELECT 
    avg(sleep_duration) as average_sleep_duration,
    avg(sports_duration) as average_sports_duration,
    avg(study_duration) as average_study_duration,
    avg(eating_quality) as average_eating_quality,
    avg(generic_mood_morning) as average_mood_morning,
    avg(generic_mood_evening) as average_mood_evening
    FROM reports WHERE reported_date > CURRENT_DATE - interval '7 days'`);

  return res?.rowsOfObjects() || [];
};

const getSummaryDate = async (date: string) => {
  const res = await executeQuery(
    `SELECT 
    avg(sleep_duration) as average_sleep_duration,
    avg(sports_duration) as average_sports_duration,
    avg(study_duration) as average_study_duration,
    avg(eating_quality) as average_eating_quality,
    avg(generic_mood_morning) as average_mood_morning,
    avg(generic_mood_evening) as average_mood_evening
    FROM reports WHERE reported_date = $1`,
    date
  );

  return res?.rowsOfObjects() || [];
};

const getAverageMood = async () => {
  const res = await executeQuery(`SELECT 
    avg(generic_mood_morning) as average_mood_morning,
    avg(generic_mood_evening) as average_mood_evening, reported_date
    FROM reports WHERE reported_date > CURRENT_DATE - 2 group by reported_date`);

  const data =
    res?.rowsOfObjects().map((reporting) => {
      const {
        average_mood_morning,
        average_mood_evening,
        reported_date,
      } = reporting;
      return {
        average: (+average_mood_morning + +average_mood_evening) / 2,
        date: reported_date,
      };
    }) || [];

  return data;
};

export {
  getSummaryWeek,
  getSummaryMonth,
  getLastWeekSum,
  getSummaryDate,
  getAverageMood,
};
