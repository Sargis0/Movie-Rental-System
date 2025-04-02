import {DataManager} from "../data-manager/DataManager.js";
import {IdGenerator} from "../utils/IdGenerator.js";

export class CustomerController {
    static #CUSTOMER_FILE = "customers.json";
    static #CUSTOMER_ID_PREFIX = "C";

    async register(request, response) {
        try {
            const customerData = request.body;
            const customers = await DataManager.read(CustomerController.#CUSTOMER_FILE);

            const newId = IdGenerator.generateNextId(
                customers,
                CustomerController.#CUSTOMER_ID_PREFIX
            );

            const newCustomer = {
                id: newId,
                ...customerData
            };

            customers.push(newCustomer);

            await DataManager.write(CustomerController.#CUSTOMER_FILE, customers);

            return response.status(201).json({
                success: true,
                message: "User Created SuccessFully"
            })
        } catch (error) {
            response.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async viewRentalHistory(request, response) {
        try {
            const { id } = request.params;

            const customers = await DataManager.read(CustomerController.#CUSTOMER_FILE);
            const customerExists = customers.some(customer => customer.id === id);

            if (!customerExists) {
                return response.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }

            const rentals = await DataManager.read("rentals.json");
            const customerRentals = rentals.filter(rental => rental.customerId === id);

            response.status(200).json({
                success: true,
                data: customerRentals
            });
        } catch (error) {
            response.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
