import { Router } from "express";

import { addSchool, listSchools } from "../controllers/school.controller.js";
import { validateAddSchool, validateListSchools } from "../middleware/validate.middleware.js";

const schoolRouter = Router();

schoolRouter.post('/addSchool',   validateAddSchool,   addSchool);
schoolRouter.get('/listSchools',  validateListSchools, listSchools);

export default schoolRouter;