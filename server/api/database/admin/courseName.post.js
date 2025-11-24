import { getClient } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const { name, courseId } = await readBody(event);
    const client = getClient();

    if (!name || !courseId) {
        return {
            success: false,
            error: "Course ID is required.",
        };
    }

    try {
        await client.connect();

        await client.query(
            "UPDATE course SET name = $1 WHERE id = $2",
            [name, courseId]
        );

        return {
            success: true
        };
    } catch (err) {
        if (err.statusCode) {
            return {
                success: false,
                error: err.message,
            };
        }
        return {
            success: false,
            error: "Unexpected server error: " + err.message,
        };
    } finally {
        await client.end();
    }
});
