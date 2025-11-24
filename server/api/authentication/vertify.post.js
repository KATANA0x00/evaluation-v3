import jwt from "jsonwebtoken";

export default defineEventHandler((event) => {
    const token = getHeaders(event).authorization?.split(" ")[1];
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: "No token provided.",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "00000000000000000000000000000000"
        );
        return {
            success: true,
            message: "✅ Token is valid.",
            user: decoded,
        };
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid or expired token.",
        });
    }
});
