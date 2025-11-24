import { getClient } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const client = getClient();

    try {
        await client.connect();

        const { rows } = await client.query(
            "SELECT id, name, number FROM course ORDER BY id DESC"
        );

        return {
            success: true,
            courseList: rows,
        };
    } catch (err) {
        // Handle expected errors
        if (err.statusCode) {
            return {
                success: false,
                courseList: [],
                error: err.message,
            };
        }
        return {
            success: false,
            courseList: [],
            error: "Unexpected server error: " + err.message,
        };
    } finally {
        await client.end();
    }
});
