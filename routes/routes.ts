import { Router } from "../deps.ts";
import { main, morningReport, eveningReport, showSummaryWeek, showSummaryMonth } from "./controllers/controller.ts";
import { setEveningReport, setMorningReport, setSummaryWeek, setSummaryMonth } from './apis/api.ts'

const router = new Router();

router.get("/", main)
.get('/behavior/reporting/morning', morningReport)
.get('/behavior/reporting/evening', eveningReport)
.get('/behavior/summary/weekly', showSummaryWeek)
.get('/behavior/summary/monthly', showSummaryMonth)

router.post('/behavior/reporting/morning', setMorningReport)
.post("/behavior/reporting/evening", setEveningReport)

router.post('/behavior/summary/week', setSummaryWeek)
.post('/behavior/summary/month', setSummaryMonth)
// router.get('/', hello);

// router.get('/api/hello', helloApi.getHello);
// router.post('/api/hello', helloApi.setHello);

export { router };