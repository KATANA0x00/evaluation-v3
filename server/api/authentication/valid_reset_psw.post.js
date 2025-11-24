import { getClient } from "~~/server/utils/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
    const { sessionKey } = await readBody(event);
    const client = getClient();

    try {
        await client.connect();

        const generatedPassword = crypto.randomBytes(8).toString("hex");
        const hashed = await bcrypt.hash(generatedPassword, 10);

        const { rows } = await client.query(
            `UPDATE accounts_user
            SET psw_hashed = $1,
                reset_session_key = NULL,
                reset_session_expire = NULL
            WHERE reset_session_key = $2 AND reset_session_expire > NOW()
            RETURNING email
            `,
            [hashed, sessionKey]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: "SESSTION EXPIRED.",
            };
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"KMITL, Password Generator" <${process.env.EMAIL_USER}>`,
            to: rows[0].email,
            subject: "KMITL, Password Generator",
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
                    >Password Generator</span
                ><br />
                </div>
                <span>Your new password has been generated:</span><br />
                <div
                style="
                    background-color: lightgray;
                    width: fit-content;
                    padding: 0 12px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                "
                >
                <span style="font-weight: 600;letter-spacing: 0.5px;">${generatedPassword}</span>
                </div>
            </div>
            </div>
                    `,
        };
        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "PASSWORD HAS BEEN RESETED!!",
        };
    } catch (err) {
        return {
            success: false,
            message: "Server error",
        };
    } finally {
        await client.end();
    }
});
