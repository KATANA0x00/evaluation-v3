import { getClient } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const { user_id } = getQuery(event);
    const client = getClient();

    try {
        await client.connect();

        const { rows } = await client.query(
            "SELECT c.id, c.name, e.progress, e.approved, c.number FROM evaluation e JOIN course c ON c.id = e.course_id WHERE e.user_id = $1;",
            [user_id]
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
