import { initTables } from "../utils/initTables";

export default async () => {
    try {
        if (process.env.DEVELOPMENT) {
            return;
        }
        await initTables();
    } catch (err) {
        console.error("❌ Failed to initialize DB:", err);
    }
};
