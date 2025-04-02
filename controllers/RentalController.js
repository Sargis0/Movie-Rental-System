import {DataManager} from "../data-manager/DataManager.js";
import {IdGenerator} from "../utils/IdGenerator.js";

export class RentalController {
    static #RENTAL_FILE = "rentals.json";
    static #RENTAL_ID_PREFIX = "R";
    static #MOVIE_FILE = "movies.json";

    async rentMovie(request, response) {
        try {
            const { customerId, movieId, rentalDuration } = request.body;
            const rentals = await DataManager.read(RentalController.#RENTAL_FILE);
            const movies = await DataManager.read(RentalController.#MOVIE_FILE);

            const movie = movies.find(m => m.id === movieId);
            if (!movie) {
                return response.status(404).json({
                    success: false,
                    message: "Movie not found"
                });
            }

            const activeRental = rentals.find(rent =>
                rent.movieId === movieId && !rent.dateReturned
            );
            if (activeRental) {
                return response.status(400).json({
                    success: false,
                    message: "Movie is already rented"
                });
            }

            const newId = IdGenerator.generateNextId(
                rentals,
                RentalController.#RENTAL_ID_PREFIX
            );

            const newRental = {
                id: newId,
                customerId,
                movieId,
                rentalDuration,
                dateRented: new Date().toISOString().split('T')[0],
                dateReturned: null
            };

            rentals.push(newRental);
            await DataManager.write(RentalController.#RENTAL_FILE, rentals);

            response.status(201).json({
                success: true,
                data: newRental
            });
        } catch (error) {
            response.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async returnMovie(request, response) {
        try {
            const { rentalId } = request.body;
            const rentals = await DataManager.read(RentalController.#RENTAL_FILE);

            const rental = rentals.find(rent => rent.id === rentalId);
            if (!rental) {
                return response.status(404).json({
                    success: false,
                    message: "Rental not found"
                });
            }

            if (rental.dateReturned) {
                return response.status(400).json({
                    success: false,
                    message: "Movie already returned"
                });
            }

            rental.dateReturned = new Date().toISOString().split('T')[0];
            await DataManager.write(RentalController.#RENTAL_FILE, rentals);

            response.status(200).json({
                success: true,
                data: rental
            });
        } catch (error) {
            response.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
