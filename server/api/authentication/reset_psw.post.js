import { getClient } from "~~/server/utils/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
    const { email } = await readBody(event);
    const client = getClient();

    try {
        await client.connect();

        const { rows } = await client.query(
            "SELECT psw_hashed FROM accounts_user WHERE email = $1",
            [email]
        );

        // Case 1: No account found
        if (rows.length === 0) {
            return {
                success: false,
                message:
                    "No account found. Please verify your email or contact the administrator.",
            };
        }

        const session_key = crypto.randomBytes(4).toString("hex");
        const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
        await client.query(
            "UPDATE accounts_user SET reset_session_key = $1, reset_session_expire = $3 WHERE email = $2",
            [session_key, email, expirationTime]
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${(process.env.NUXT_URL || "").replace(
            /\/$/,
            ""
        )}/password_forgotten/${encodeURIComponent(session_key)}`;

        const mailOptions = {
            from: `"KMITL, Password generator" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "KMITL: Password reset request",
            html: `
            <div
            style="
                background-color: orangered;
                width: fit-content;
                padding: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: sans-serif;
            "
            >
            <div
                style="
                background-color: white;
                width: fit-content;
                padding: 5px 15px;
                line-height: 40px;
                border-radius: 10px;
                "
            >
                <div style="width: 100%; border-bottom: 1px solid black">
                <span style="font-weight: 800; font-size: 20px"
                    >Reset your password</span
                ><br />
                </div>
                <span
                >If you requested a password reset, please click the button
                below:</span
                ><br />
                <div style="width: 100%; display: flex; justify-content: center">
                <a
                    href="${resetUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="
                    display: inline-block;
                    padding: 5px 12px;
                    background: orangered;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    "
                >
                    RESET PASSWORD </a
                ><br />
                </div>
                <span>This link will automatically </span
                ><span style="text-decoration: underline">expire in 1 hour</span
                ><span>.</span>
            </div>
            </div>
            `,
            text: `If you requested a password reset, open this link in your browser: ${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "Reset link has been send to your E-mail Address.",
        };
    } catch (err) {
        return {
            success: false,
            message: "Unexpected server error: " + err.message,
        };
    } finally {
        await client.end();
    }
});
