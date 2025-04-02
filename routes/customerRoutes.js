import {Router} from "express";
import {CustomerController} from "../controllers/CustomerController.js";

const customerRouter = Router();
const customerController = new CustomerController();

customerRouter.post("/", customerController.register);
customerRouter.get("/:id/rentals", customerController.viewRentalHistory);

export default customerRouter;
