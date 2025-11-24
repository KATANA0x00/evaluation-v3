import { getClient } from "~~/server/utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event);

    // Input validation
    if (!email || !password) {
        throw createError({
            statusCode: 400,
            message: "Email and password are required.",
        });
    }

    const client = getClient();

    try {
        await client.connect();

        // Query user by email
        const { rows } = await client.query(
            "SELECT id, email, psw_hashed, name FROM accounts_user WHERE email = $1",
            [email]
        );

        // Case 1: no user found
        if (rows.length === 0) {
            throw createError({
                statusCode: 401,
                message: "Wrong email or password.",
            });
        }

        const user = rows[0];

        if(user.psw_hashed === null) {
            throw createError({
                statusCode: 401,
                message: "You have NOT created a password yet.",
            });
        }

        // Case 2: password mismatch
        const valid = await bcrypt.compare(password, user.psw_hashed);
        if (!valid) {
            throw createError({
                statusCode: 401,
                message: "Wrong email or password.",
            });
        }

        // Case 3: success — generate JWT token
        const token = jwt.sign(
            {
                user_id: user.id,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET || "00000000000000000000000000000000", // fallback for testing
            { expiresIn: "1d" }
        );

        return {
            success: true,
            message: "Login successful.",
            token
        };
    } catch (err) {
        // Handle expected errors
        if (err.statusCode) {
            return {
                success: false,
                message: err.message,
            };
        }

        // Handle unexpected errors
        return {
            success: false,
            message: "Unexpected server error: " + err.message,
        };
    } finally {
        await client.end();
    }
});
