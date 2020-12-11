import { Router } from "../deps.ts";
import { showLandingPage, morningReport, eveningReport, showSummaryWeek, showSummaryMonth } from "./controllers/controller.ts";
import { setEveningReport, setMorningReport, setSummaryWeek, setSummaryMonth, getLastWeekAverage, getDayAverage } from './apis/api.ts'

const router = new Router();

router.get("/", showLandingPage)
.get('/behavior/reporting/morning', morningReport)
.get('/behavior/reporting/evening', eveningReport)
.get('/behavior/summary/weekly', showSummaryWeek)
.get('/behavior/summary/monthly', showSummaryMonth)

router.get('/api/summary', getLastWeekAverage)
.get('/api/summary/:year/:month/:day', getDayAverage)


router.post('/behavior/reporting/morning', setMorningReport)
.post("/behavior/reporting/evening", setEveningReport)

router.post('/behavior/summary/week', setSummaryWeek)
.post('/behavior/summary/month', setSummaryMonth)

export { router };