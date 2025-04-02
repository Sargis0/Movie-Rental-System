import {Router} from "express";
import {RentalController} from "../controllers/RentalController.js";

const rentalRouter = Router();
const rentalController = new RentalController();

rentalRouter.post("/", rentalController.rentMovie);
rentalRouter.post("/return", rentalController.returnMovie);

export default rentalRouter;
