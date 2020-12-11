import { assertEquals } from "../deps.ts";
import { isEmpty } from "../helpers/helpers.ts";
import {
  validateEveningReport,
  validateMorningReport,
  validateRegistrationForm,
} from "../helpers/validation.ts";

Deno.test("Helper function should return true if oject is empty", () => {
  assertEquals(true, isEmpty({}));
});

Deno.test("Helper function should return false if object is not empty", () => {
  assertEquals(false, isEmpty({ random_key: "should_not_exist" }));
});

Deno.test("Helper function should return false if object is not empty", () => {
  assertEquals(false, isEmpty({ [`${Math.random()}`]: "should_not_exist" }));
});

Deno.test("Registration form should be validated correctly", async () => {
  const correctData = {
    email: "example@gmail.com",
    password: "1234",
  };

  const validation = await validateRegistrationForm(correctData);
  console.log(validation);
  assertEquals(true, isEmpty(validation));
});

Deno.test("Registration form should be validated correctly", async () => {
  const incorrectData = {
    email: "example",
    password: "1234",
  };

  const validation = await validateRegistrationForm(incorrectData);
  assertEquals(1, Object.keys(validation).length);
});

Deno.test("Registration form should be validated correctly", async () => {
  const incorrectData = {
    email: "example@abc.com",
    password: "123",
  };

  const validation = await validateRegistrationForm(incorrectData);
  assertEquals(1, Object.keys(validation).length);
});

Deno.test("Registration form should be validated correctly", async () => {
  const incorrectData = {
    email: "example",
    password: "124",
  };

  const validation = await validateRegistrationForm(incorrectData);
  assertEquals(2, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const correctData = {
    sports_duration: 1.5,
    study_duration: 25,
    generic_mood: 1,
    eating_quality: 1,
    date: "2020-12-11",
  };

  const validation = await validateEveningReport(correctData);
  assertEquals(true, isEmpty(validation));
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sports_duration: -12,
    study_duration: -100,
    generic_mood: 6,
    eating_quality: 0,
    date: "2020-1-32",
  };

  const validation = await validateEveningReport(incorrectData);
  assertEquals(5, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sports_duration: -12,
    study_duration: -100,
    generic_mood: 6,
    eating_quality: 1,
    date: "2020-1-32",
  };

  const validation = await validateEveningReport(incorrectData);
  assertEquals(4, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sports_duration: -12,
    study_duration: -100,
    generic_mood: 5,
    eating_quality: 1,
    date: "2020-1-32",
  };

  const validation = await validateEveningReport(incorrectData);
  assertEquals(3, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sports_duration: -12,
    study_duration: 1,
    generic_mood: 5,
    eating_quality: 1,
    date: "2020-1-32",
  };

  const validation = await validateEveningReport(incorrectData);
  assertEquals(2, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sports_duration: 12,
    study_duration: 1,
    generic_mood: 5,
    eating_quality: 1,
    date: "2020-1-32",
  };

  const validation = await validateEveningReport(incorrectData);
  assertEquals(1, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sports_duration: 12.4,
    study_duration: 1,
    generic_mood: 5,
    eating_quality: 1,
    date: "2020-1-32",
  };

  const validation = await validateEveningReport(incorrectData);
  assertEquals(1, Object.keys(validation).length);
});

Deno.test("Morning report form should be validated correctly", async () => {
  const correctData = {
    sleep_duration: 1.5,
    generic_mood: 1,
    sleep_quality: 1,
    date: "2020-12-11",
  };

  const validation = await validateMorningReport(correctData);
  assertEquals(true, isEmpty(validation));
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sleep_duration: -123,
    generic_mood: 0,
    sleep_quality: 12,
    date: "2020-1-33",
  };

  const validation = await validateMorningReport(incorrectData);
  assertEquals(4, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sleep_duration: 3,
    generic_mood: 0,
    sleep_quality: 12,
    date: "2020-1-33",
  };

  const validation = await validateMorningReport(incorrectData);
  assertEquals(3, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sleep_duration: 3,
    generic_mood: 2,
    sleep_quality: 12,
    date: "2020-1-33",
  };

  const validation = await validateMorningReport(incorrectData);
  assertEquals(2, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sleep_duration: 3,
    generic_mood: 2,
    sleep_quality: 3,
    date: "2020-1-33",
  };

  const validation = await validateMorningReport(incorrectData);
  assertEquals(1, Object.keys(validation).length);
});

Deno.test("Evening report form should be validated correctly", async () => {
  const incorrectData = {
    sleep_duration: 3.5,
    generic_mood: 2,
    sleep_quality: 3,
    date: "2020-1-33",
  };

  const validation = await validateMorningReport(incorrectData);
  assertEquals(1, Object.keys(validation).length);
});
