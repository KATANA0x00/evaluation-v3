import { getClient } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const { approved, userId, courseId } = await readBody(event);
    const client = getClient();

    if (!userId || !courseId) {
        return {
            success: false,
            error: "User ID or Course ID is required.",
        };
    }

    try {
        await client.connect();

        await client.query(
            "UPDATE evaluation SET approved = $1 WHERE user_id = $2 AND course_id = $3",
            [approved, userId, courseId]
        );

        return {
            success: true,
            userId,
            courseId,
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
