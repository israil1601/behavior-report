import {
  isDate,
  isEmail,
  isInt,
  lengthBetween,
  match,
  minNumber,
  numberBetween,
  required,
  validate,
} from "../deps.ts";

const getWeek = (date: Date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(
    ((date.getTime() - startDate.getTime()) / 86400000 +
      startDate.getDay() +
      1) /
      7
  );
};

const isEmpty = (obj: object) => Object.keys(obj).length === 0 && obj.constructor === Object;

const headerState = async (session) => {
  const isAuth = await session.get("authenticated");
  const userObj = await session.get("user");
  const email = userObj?.email || "";
  return {
    isAuth,
    email,
  };
};

const validateRegistrationForm = async (data: {
  email: string;
  password: string;
}) => {
  const validationRules = {
    email: [required, isEmail],
    password: [required, lengthBetween(4, 30)],
  };

  const [passes, errors] = await validate(data, validationRules);

  return passes ? {} : errors;
};

const validateMorningReport = async (data: {
  sleep_duration: number;
  sleep_quality: number;
  generic_mood: number;
  date: string
}) => {
  const validationRules = {
    sleep_duration: [required, minNumber(0)],
    sleep_quality: [required, numberBetween(1, 5), isInt],
    generic_mood: [required, numberBetween(1, 5), isInt],
    date: [required, isDate, match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/)]
  };

  const [passes, errors] = await validate(data, validationRules);

  return passes ? {} : errors;
};

const validateEveningReport = async (data: {
  sports_duration: number;
  study_duration: number;
  generic_mood: number;
  eating_quality: number;
  date: string
}) => {
  const validationRules = {
    sports_duration: [required, minNumber(0)],
    study_duration: [required, minNumber(0)],
    eating_quality: [required, numberBetween(1, 5), isInt],
    generic_mood: [required, numberBetween(1, 5), isInt],
    date: [required, isDate, match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/)]
  }

  const [passes, errors] = await validate(data, validationRules);

  return passes ? {} : errors;
};

export {
  getWeek,
  headerState,
  validateRegistrationForm,
  validateMorningReport,
  validateEveningReport,
  isEmpty
};
