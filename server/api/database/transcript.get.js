import { getClient } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const { course_id, user_id } = getQuery(event);
    const client = getClient();

    try {
        await client.connect();

        const skillList = await client.query(
            `
            SELECT skill FROM course WHERE id = $1
            `,
            [course_id]
        );

        const { rows } = await client.query(
            `
            SELECT scores, course.name ,accounts_user.name AS user_name, evaluation.approved, evaluation.progress
            FROM evaluation 
            LEFT JOIN course ON course.id = evaluation.course_id
            LEFT JOIN accounts_user ON evaluation.user_id = accounts_user.id
            WHERE evaluation.user_id = $1 
            AND evaluation.course_id = $2;
            `,
            [user_id, course_id]
        );

        // Parse scores JSON
        rows.forEach((row) => {
            if (row.scores && typeof row.scores === "string") {
                try {
                    row.scores = JSON.parse(row.scores);
                } catch (e) {
                    row.scores = null;
                }
            }
        });

        const baseScores = rows[0].scores || [];

        const mergedScores = skillList.rows[0].skill.map((skillName) => {
            const existing = baseScores.find((s) => s.skill === skillName);
            return {
                skill: skillName,
                level: existing ? existing.level : 0,
            };
        });

        // Replace datas.scores with mergedScores
        rows[0].scores = mergedScores;
        return {
            success: true,
            datas: rows[0]
        };
    } catch (err) {
        // Handle expected errors
        if (err.statusCode) {
            return {
                success: false,
                datas: {},
                error: err.message,
            };
        }
        console.log(err)
        return {
            success: false,
            datas: {},
            error: "Unexpected server error: " + err.message,
        };
    } finally {
        await client.end();
    }
});
