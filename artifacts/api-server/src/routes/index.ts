import { Router, type IRouter } from "express";
import healthRouter from "./health";
import binLookupRouter from "./bin-lookup";

const router: IRouter = Router();

router.use(healthRouter);
router.use(binLookupRouter);

export default router;
