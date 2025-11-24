export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const user_token = localStorage.getItem("auth_token");
    const userInfo = useState("userInfo", () => null);

    if (to.path.startsWith("/auth/")) {
        if (!user_token) {
            userInfo.value = null;
            return navigateTo("/");
        }

        try {
            const response = await $fetch("/api/authentication/vertify", {
                method: "POST",
                headers: { Authorization: `Bearer ${user_token}` },
            });
            if (response.success) {
                userInfo.value = response.user;
            }
        } catch {
            localStorage.removeItem("auth_token");
            userInfo.value = null;
            return navigateTo("/");
        }
    }

    const admin_token = localStorage.getItem("admin_token");
    const adminInfo = useState("adminInfo", () => null);

    if (to.path.startsWith("/administrator/")) {
        if (!admin_token) {
            adminInfo.value = null;
            return navigateTo("/administrator");
        }

        try {
            const response = await $fetch("/api/authentication/vertify", {
                method: "POST",
                headers: { Authorization: `Bearer ${admin_token}` },
            });
            if (response.success) {
                adminInfo.value = response.user;
            }
        } catch {
            localStorage.removeItem("admin_token");
            adminInfo.value = null;
            return navigateTo("/administrator");
        }
    }
});
