import { Client } from "pg";

export const getClient = () => {
    return new Client({
        host: process.env.PG_HOST || "localhost",
        port: Number(process.env.PG_PORT) || 5432,
        database: process.env.PG_DB || "evaluation",
        user: process.env.PG_USER || "admin",
        password: process.env.PG_PASSWORD || "12345678",
    });
};
