import { RouterContext } from "../../deps.ts";
import { getHeaderState, isEmpty } from "../../helpers/helpers.ts";
import { validateMorningReport, validateEveningReport } from "../../helpers/validation.ts";
import {
  postEveningReport,
  postMorningReport,
} from "../../services/reportService.ts";

// Post morning reporting data
const setMorningReport = async ({
  request,
  response,
  session,
  render,
}: RouterContext) => {
  const body = request.body();
  const content = await body.value;

  const date = content.get("date");

  // if null, do not convert to 0 (for validation);
  const sleep_duration = content.get("sleep_duration")
    ? +content.get("sleep_duration")
    : null;
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
      ...(await getHeaderState(session)),
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
      ...(await getHeaderState(session)),
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

export { setMorningReport, setEveningReport };
