import { getClient } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const { studentList } = await readBody(event);
    const { course_id } = getQuery(event);
    const client = getClient();

    try {
        await client.connect();

        const { rows } = await client.query(
            "SELECT skill FROM course WHERE id = $1",
            [course_id]
        );

        // Case 1: No account found
        if (rows.length === 0) {
            return {
                success: false,
                message: `No Course found. at course id = ${course_id}.`,
            };
        }

        // Case 3: Generate and store password
        let added = [];
        for (const user of studentList) {
            if (!user.email) continue;
            const userId = await client.query(
                `
                INSERT INTO accounts_user (email, name)
                VALUES ($1, $2)
                ON CONFLICT (email) DO UPDATE
                SET email = accounts_user.email
                RETURNING id;
                `,
                [user.email, user.name]
            );
            if(!userId.rows[0]) continue;

            const userSkillMap = new Map(
                user.skill.map((s) => [s.skill, s.level])
            );

            const scores = rows[0].skill.map((skill) => ({
                skill,
                level: userSkillMap.get(skill) || 0,
            }));

            await client.query(
                `
                INSERT INTO evaluation (user_id, course_id, scores, approved, progress)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (user_id, course_id) DO NOTHING
                `,
                [
                    userId.rows[0].id,
                    course_id,
                    JSON.stringify(scores),
                    user.approved,
                    user.progress,
                ]
            );
            added.push(user.email);
        }

        return {
            success: true,
            message: "User added Successfully.",
            added: added,
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
