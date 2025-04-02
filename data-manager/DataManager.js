import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DataManager {
    static async read(fileName) {
        try {
            const filePath = path.join(__dirname, "../data", fileName);
            const data = await fs.readFile(filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            return error;
        }
    }

    static async write(fileName, data) {
        const filePath = path.join(__dirname, "../data", fileName);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    }
}
