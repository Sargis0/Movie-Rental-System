import {Router} from "express";
import {MovieController} from "../controllers/MovieController.js";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.post("/", movieController.addMovie);
movieRouter.get("/", movieController.searchMovies);

export default movieRouter;
