import { getClient } from "./db";

let initialized = false; // ✅ ensure runs once per server runtime

export async function initTables() {
    if (initialized) return;
    initialized = true;

    const client = getClient();
    await client.connect();

    try {
        // Create accounts_user table
        await client.query(`
        CREATE EXTENSION IF NOT EXISTS pgcrypto;

        CREATE TABLE IF NOT EXISTS accounts_user (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT NOT NULL UNIQUE,
            psw_hashed TEXT,
            name TEXT NOT NULL DEFAULT 'สมชาย ใจดี',
            reset_session_key TEXT,
            reset_session_expire TIMESTAMPTZ
        )
        `);

        await client.query(`
        CREATE TABLE IF NOT EXISTS accounts_admin (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            psw_hashed TEXT
        )
        `);
        await client.query(
            `
        INSERT INTO accounts_admin (id, email, psw_hashed)
            VALUES ($1, $2, $3)
            ON CONFLICT (id) DO NOTHING
        `,
            [
                "aaaaaaaa",
                "admin.aiml@dev",
                "$2b$10$NaKLlIFFD6d59XFyN22SmuwU.2.XySP08AHgMifAnOBu1vCuSEAKC",
            ]
        );

        // Create course table
        await client.query(`
        CREATE TABLE IF NOT EXISTS course (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            skill JSONB NOT NULL DEFAULT '[]'::jsonb
        )
        `);

        // Create evaluation table
        await client.query(`
        CREATE TABLE IF NOT EXISTS evaluation (
            user_id UUID REFERENCES accounts_user(id),
            course_id INT REFERENCES course(id),
            scores JSONB NOT NULL DEFAULT '[]'::jsonb,
            approved BOOLEAN DEFAULT false NOT NULL,
            progress INT4 DEFAULT 0 NOT NULL,
            PRIMARY KEY (user_id, course_id)
        )
        `);

        console.log("✅ Tables checked/created successfully");
    } catch (err) {
        console.error("❌ Failed to initialize tables:", err);
    } finally {
        await client.end();
    }
}
