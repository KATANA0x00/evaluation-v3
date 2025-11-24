import { getClient } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const { course_id } = getQuery(event);
    const client = getClient();

    if (!course_id) {
        return {
            success: false,
            datas: null,
            error: "Course ID is required.",
        };
    }

    try {
        await client.connect();

        const courseDetailRes = await client.query(
            "SELECT name, skill FROM course WHERE id = $1",
            [course_id]
        );
        const courseDetail = courseDetailRes.rows[0] || null;
        if (courseDetail?.skill) {
            try {
                if (typeof courseDetail.skill === "string") {
                    courseDetail.skill = JSON.parse(courseDetail.skill);
                }
            } catch (e) {
                courseDetail.skill = null;
            }
        }

        const evaluationRes = await client.query(
            `SELECT user_id, scores, progress, approved, accounts_user.name, accounts_user.email
            FROM evaluation
            LEFT JOIN accounts_user ON evaluation.user_id = accounts_user.id
            WHERE course_id = $1`,
            [course_id]
        );
        evaluationRes.rows = evaluationRes.rows.map((row) => {
            if (row.scores) {
                try {
                    if (typeof row.scores === "string") {
                        row.scores = JSON.parse(row.scores);
                    }
                } catch (e) {
                    row.scores = null;
                }
            }
            return row;
        });

        return {
            success: true,
            datas: {
                ...(courseDetail || {}),
                students: evaluationRes.rows,
            },
        };
    } catch (err) {
        if (err.statusCode) {
            return {
                success: false,
                datas: null,
                error: err.message,
            };
        }
        return {
            success: false,
            datas: null,
            error: "Unexpected server error: " + err.message,
        };
    } finally {
        await client.end();
    }
});
