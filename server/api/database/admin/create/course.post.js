import { getClient } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const { courseName, courseNumber, skillsList } = await readBody(event);
    const client = getClient();

    try {
        await client.connect();

        const { rows } = await client.query(
            "INSERT INTO course (name, skill, number) VALUES ($1, $2, $3) RETURNING id;",
            [courseName, JSON.stringify(skillsList), courseNumber]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: `Something Wrong name = ${courseName}.`,
            };
        }

        return {
            success: true,
            message: "Course added Successfully.",
            courseId: rows[0].id,
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: "Unexpected server error: " + err.message,
        };
    } finally {
        await client.end();
    }
});
