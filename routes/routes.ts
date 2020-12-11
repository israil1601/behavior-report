import { Router } from "../deps.ts";
import {
  showLandingPage,
  showMorningReport,
  showEveningReport,
  showSummaryWeek,
  showSummaryMonth,
} from "./controllers/controller.ts";
import {
  setSummaryWeek,
  setSummaryMonth,
  getLastWeekAverage,
  getDayAverage,
} from "./apis/api.ts";
import {
  showLoginForm,
  showRegistrationForm,
  logOut,
  authenticate,
  register,
} from "./controllers/userController.ts";
import { setEveningReport, setMorningReport } from "./apis/reportApi.ts";

const router = new Router();

// Views
router
  .get("/", showLandingPage)
  .get("/behavior/reporting/morning", showMorningReport)
  .get("/behavior/reporting/evening", showEveningReport)
  .get("/behavior/summary/weekly", showSummaryWeek)
  .get("/behavior/summary/monthly", showSummaryMonth);

// Auth related
router
  .get("/auth/login", showLoginForm)
  .get("/auth/register", showRegistrationForm)
  .get("/auth/logout", logOut);

// API
router
  .get("/api/summary", getLastWeekAverage)
  .get("/api/summary/:year/:month/:day", getDayAverage);

// Post reportings
router
  .post("/behavior/reporting/morning", setMorningReport)
  .post("/behavior/reporting/evening", setEveningReport);

// Weekly/Monthly summary
router
  .post("/behavior/summary/week", setSummaryWeek)
  .post("/behavior/summary/month", setSummaryMonth);

router.post("/auth/login", authenticate).post("/auth/register", register);

export { router };
