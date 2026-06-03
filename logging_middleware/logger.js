require("dotenv").config();

const TOKEN = process.env.LOGGING_AUTH_TOKEN;
const LOG_URL = process.env.LOG_URL;

async function Log(stack, level, pkg, message) {
    try {
        const response = await fetch(LOG_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

                "Authorization": `Bearer ${TOKEN}`
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message
            })
        });

        const data = await response.json();

        return data;
    }
    catch (err) {
        
        console.error("Logging failed:", err.message);
        return null;
    }
}

module.exports = Log;