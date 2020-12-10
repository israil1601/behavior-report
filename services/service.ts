import { executeQuery } from "../database/database.ts";

const getReport = async (userId: number, date: string) => {
  const res = await executeQuery(
    `SELECT * FROM reports WHERE user_id = $1 AND reported_date = $2`,
    userId,
    date
  );

  return res?.rowsOfObjects() || [];
};

const getMorningReport = async (userId: number, date: string) => {
  const report = await getReport(userId, date);

  return report.filter(
    ({ sleep_duration, sleep_quality, generic_mood_morning }) =>
      sleep_duration && sleep_quality && generic_mood_morning
  );
};

const getEveningReport = async (userId: number, date: string) => {
  const res = await getReport(userId, date);

  return res.filter(
    ({
      sports_duration,
      study_duration,
      eating_quality,
      generic_mood_evening,
    }) =>
      sports_duration &&
      study_duration &&
      eating_quality &&
      generic_mood_evening
  );
};

const postMorningReport = async (
  sleepDuration: number,
  sleepQuality: number,
  genericMood: number,
  date: string,
  userId: number
) => {
  const res = await getReport(userId, date);
  if (!res.length) {
    await executeQuery(
      "INSERT INTO reports (sleep_duration, sleep_quality, generic_mood_morning, reported_date, user_id) VALUES ($1, $2, $3, $4, $5)",
      sleepDuration,
      sleepQuality,
      genericMood,
      date,
      userId
    );

    return;
  }

  await executeQuery(
    "UPDATE reports SET sleep_duration = $1, sleep_quality = $2, generic_mood_morning = $3 WHERE reported_date = $4 AND user_id = $5",
    sleepDuration,
    sleepQuality,
    genericMood,
    date,
    userId
  );
};

const postEveningReport = async (
  sportsDuration: number,
  studyDuration: number,
  eatingQuality: number,
  genericMood: number,
  date: string,
  userId: number
) => {
  const res = await getReport(userId, date);
  if (!res.length) {
    await executeQuery(
      "INSERT INTO reports (sports_duration, study_duration, eating_quality, generic_mood_evening, reported_date, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
      sportsDuration,
      studyDuration,
      eatingQuality,
      genericMood,
      date,
      userId
    );

    return;
  }

  await executeQuery(
    "UPDATE reports SET sports_duration = $1, study_duration = $2, eating_quality = $3, generic_mood_evening = $4 WHERE reported_date = $5 AND user_id = $6",
    sportsDuration,
    studyDuration,
    genericMood,
    eatingQuality,
    date,
    userId
  );
};

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
  if (!res || !res.rows[0].filter((i) => i).length) {
    return [];
  }

  return res?.rowsOfObjects().map((data) => {
    const obj = {};
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

  if (!res || !res.rows[0].filter((i) => i).length) {
    return [];
  }

  return res?.rowsOfObjects().map((data) => {
    const obj = {};
    for (let [key, value] of Object.entries(data)) {
      obj[key] = +value;
    }
    
    return obj;
  });
};

export {
  postMorningReport,
  postEveningReport,
  getEveningReport,
  getMorningReport,
  getSummaryWeek,
  getSummaryMonth,
};
