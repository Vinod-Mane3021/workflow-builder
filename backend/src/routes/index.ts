import { Router } from "express";
import workflowRouter from "./workflow.routes";

const router = Router();

router.use("/workflow", workflowRouter);

export default router;