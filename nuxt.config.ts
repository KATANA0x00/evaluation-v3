export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["@/assets/css/tailwind.css"],

    postcss: {
        plugins: {
            "@tailwindcss/postcss": {},
        },
    },

    modules: ["@nuxt/icon"],
    runtimeConfig: {
        public: {
            apiUrl: (process.env.NUXT_URL || "http://localhost:3000") + "/api",
        },
    }
});
