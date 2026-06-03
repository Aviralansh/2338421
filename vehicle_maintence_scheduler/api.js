require("dotenv").config();
const Log = require('../logging_middleware/logger'); // Adjust this path if your folder structure is different

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${TOKEN}`
};

async function fetchDepots() {
    try {
        const response = await fetch(`${BASE_URL}/depots`, { headers });
        if (!response.ok) {
            throw new Error(`Depot API failed with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        await Log(error.stack, "ERROR", "vehicle_scheduler_api", `Failed to fetch depots: ${error.message}`);
        throw error; // Rethrow so the main execution stops
    }
}

async function fetchVehicles() {
    try {
        const response = await fetch(`${BASE_URL}/vehicles`, { headers });
        if (!response.ok) {
             throw new Error(`Vehicles API failed with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        await Log(error.stack, "ERROR", "vehicle_scheduler_api", `Failed to fetch vehicles: ${error.message}`);
        throw error;
    }
}

async function getTotalMechanicHours() {
    const data = await fetchDepots();
    return data.depots.reduce((total, depot) => total + depot.MechanicHours, 0);
}

module.exports = { fetchVehicles, getTotalMechanicHours };