import multer from "multer";
import { createWorkflow, executeWorkflow, getWorkflow, getWorkflows, updateWorkflow } from "../controllers/workflow";
import { Router } from "express";

// Set up file upload handling with Multer
export const upload = multer({ dest: 'public/uploads/' });

const workflowRouter = Router();

workflowRouter.get("/", getWorkflows)
workflowRouter.get("/:id", getWorkflow)
workflowRouter.post("/create", createWorkflow)
workflowRouter.post("/update", updateWorkflow)
workflowRouter.post("/execute/:id", upload.single('file'), executeWorkflow)

export default workflowRouter;