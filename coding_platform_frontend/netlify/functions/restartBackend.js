export async function handler(event, context) {
    try {
        const response = await fetch(import.meta.env.VITE_RENDER_WEBHOOK_URL, {
            method: "POST",
        });

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Backend restart triggered successfully" }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to restart backend" }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error restarting backend", details: error.message }),
        };
    }
}
