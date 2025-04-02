import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "node:http";

import customerRouter from "./routes/customerRoutes.js";
import rentalRouter from "./routes/rentalRoutes.js";
import movieRouter from "./routes/movieRoutes.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8081;

app.use(cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"]
}));

app.use(express.json());

app.use("/movies", movieRouter);
app.use("/customers", customerRouter);
app.use("/rentals", rentalRouter);

class App {
    static start() {
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })
    }
}

App.start();
