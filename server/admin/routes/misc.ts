import * as express from "express";
import MiscController from "admin/controllers/misc/misc.controller";
import * as MiscValidation from "../controllers/misc/misc.validation";

const router = express.Router();

const { validateGetMetricsQuery } = MiscValidation;

const { getDashboardMetrics } = MiscController;

router.get("/dashboard-metrics", validateGetMetricsQuery, getDashboardMetrics);

export default router;
