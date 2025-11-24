import { getClient } from "~~/server/utils/db";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
    const { password } = await readBody(event);
    const client = getClient();

    try {
        await client.connect();
        const hashed = await bcrypt.hash(password, 10);

        return {hashed}
    } catch (err) {
        return {
            success: false,
            message: "Unexpected server error: " + err.message,
        };
    } finally {
        await client.end();
    }
});
