import { getClient } from "../utils/db";

export default defineEventHandler(async (event) => {
    const client = getClient();
    try {
        await client.connect();
        const res = await client.query(
            "SELECT * FROM accounts_user ORDER BY id"
        );
        return res.rows;
    } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        return { error: true, message: err.message };
    } finally {
        await client.end();
    }
});
