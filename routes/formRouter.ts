import { Router } from "express";
import { careerFormController } from "../controllers/career.controller.js";
import { joinUsController } from "../controllers/join-us.controller.js";
import { becomeController } from "../controllers/become.controller.js";
import { helpController } from "../controllers/help.controller.js";
import { serviceController } from "../controllers/service.controller.js";
import { enquiryController } from "../controllers/enquiry.controller.js";
import { brochureController } from "../controllers/brochure.controller.js";

export const formRouter = Router();

formRouter.post("/careers", careerFormController);
formRouter.post("/join-us", joinUsController)
formRouter.post("/become-certified", becomeController)
formRouter.post("/help", helpController)
formRouter.post("/services", serviceController)
formRouter.post("/enquiry", enquiryController)
formRouter.post("/send-brochure", brochureController)
