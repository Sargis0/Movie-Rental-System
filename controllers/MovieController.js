import {DataManager} from "../data-manager/DataManager.js";
import {IdGenerator} from "../utils/IdGenerator.js";

export class MovieController {
    static #MOVIE_FILE = "movies.json";
    static #MOVIE_ID_PREFIX = "MOV";

    async addMovie(request, response) {
        try {
            const movieData = request.body;
            const movies = await DataManager.read(MovieController.#MOVIE_FILE);

            if (!movieData.title || !movieData.genre) {
                return response.status(400).json({
                    success: false,
                    message: "Title and genre are required fields"
                });
            }

            const newId = IdGenerator.generateNextId(
                movies,
                MovieController.#MOVIE_ID_PREFIX
            );

            const newMovie = {
                id: newId,
                title: movieData.title,
                genre: movieData.genre,
                rating: movieData.rating || 0,
                ...(movieData.description && { description: movieData.description })
            };

            const existingMovie = movies.find(movie =>
                movie.title.toLowerCase() === newMovie.title.toLowerCase()
            );

            if (existingMovie) {
                return response.status(409).json({
                    success: false,
                    message: "Movie with this title already exists"
                });
            }

            movies.push(newMovie);
            await DataManager.write(MovieController.#MOVIE_FILE, movies);

            return response.status(201).json({
                success: true,
                message: "Movie added successfully",
                data: newMovie
            });
        } catch (error) {
            response.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async searchMovies(request, response) {
        try {
            const {genre, title} = request.body;
            const movies = await DataManager.read(MovieController.#MOVIE_FILE);
            let filteredMovies = movies;

            if (genre) {
                filteredMovies = filteredMovies.filter(movie =>
                    movie.genre.toLowerCase().includes(genre.toLowerCase())
                );
            }

            if (title) {
                filteredMovies = filteredMovies.filter(movie =>
                    movie.title.toLowerCase().includes(title.toLowerCase())
                );
            }

            response.status(200).json({
                success: true,
                data: filteredMovies
            });
        } catch (error) {
            response.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
