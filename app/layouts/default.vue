<template>
    <div class="flex flex-col min-h-screen bg-(--white-base)">
        <!-- Navbar -->
        <div
            class="flex items-center justify-center w-full sticky top-0 z-50 p-5 md:p-15 md:pb-10 bg-(--white-base)"
        >
            <Block class="h-fit w-full font-semibold py-2! md:py-3! px-6!">
                <div
                    class="w-full flex justify-between items-center text-sm md:text-lg"
                >
                    <div class="flex items-center justify-around gap-2 w-fit">
                        <button
                            v-if="backTo !== null"
                            @click="
                                navigateTo(backTo);
                                backTo = null;
                            "
                            class="flex items-center justify-center gap-1 text-(--text-white) bg-(--orange-base) hover:text-(--orange-base) hover:bg-(--white-shift) border border-(--orange-base) px-2 py-1 rounded-sm aspect-square smooth-trans"
                        >
                            <Icon name="mingcute:back-fill" />
                        </button>
                        <img
                            src="~/assets/logo_5.png"
                            style="height: 3rem"
                            alt="Logo"
                        />
                        <span class="font-bold text-xl hidden md:inline"
                            >Evaluation</span
                        >
                    </div>
                    <div class="flex items-center justify-center gap-3">
                        <span>{{ displayName }}</span>
                        <button
                            class="flex items-center justify-center gap-1 text-(--text-white) bg-(--text-black) hover:text-(--text-black) hover:bg-(--white-shift) border border-(--text-black) px-2 py-1 rounded-sm aspect-square md:aspect-auto smooth-trans"
                            @click="logout"
                        >
                            <span class="hidden md:inline text-sm">LOGOUT</span>
                            <Icon name="ic:round-logout" />
                        </button>
                    </div>
                </div>
            </Block>
        </div>

        <!-- Main content -->
        <div
            class="flex-1 py-3 md:py-0 px-5 md:px-15 2xl:px-32 overflow-hidden relative"
        >
            <slot></slot>
        </div>

        <div
            class="my-10 w-full bottom-3 px-5 grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr]"
        >
            <div class="flex flex-col gap-3 lg:gap-5">
                <div
                    class="flex flex-col text-center md:text-start w-full md:w-fit"
                >
                    <span
                        class="font-extrabold text-xs 2xl:text-lg text-(--orange-base)"
                        >โครงการพัฒนากำลังคนสมรรถนะสูงด้านเซมิคอนดักเตอร์ขั้นสูง</span
                    >
                    <span class="font-semibold text-xs 2xl:text-base"
                        >เทคโนโลยีเวเฟอร์และปัญญาประดิษฐ์/แมชชีนเลิร์นนิง</span
                    >
                    <span class="font-medium text-xs 2xl:text-base"
                        >สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง</span
                    >
                </div>
                <div class="flex gap-1 justify-center md:justify-start">
                    <img
                        src="~/assets/logo_1.png"
                        class="h-[1.8rem] lg:h-[2rem] 2xl:h-[3rem]"
                        alt="Logo"
                    />
                    <img
                        src="~/assets/logo_2.png"
                        class="h-[1.8rem] lg:h-[2rem] 2xl:h-[3rem]"
                        alt="Logo"
                    />
                    <img
                        src="~/assets/logo_3.png"
                        class="h-[1.8rem] lg:h-[2rem] 2xl:h-[3rem]"
                        alt="Logo"
                    />
                    <img
                        src="~/assets/logo_4.png"
                        class="h-[1.8rem] lg:h-[2rem] 2xl:h-[3rem]"
                        alt="Logo"
                    />
                    <img
                        src="~/assets/logo_5.png"
                        class="h-[1.8rem] lg:h-[2rem] 2xl:h-[3rem]"
                        alt="Logo"
                    />
                    <img
                        src="~/assets/logo_6.png"
                        class="h-[1.8rem] lg:h-[2rem] 2xl:h-[3rem]"
                        alt="Logo"
                    />
                </div>
            </div>
            <div
                class="flex flex-col items-center md:items-start text-sm md:text-base"
            >
                <span class="font-bold">CONTACT</span>
                <div class="flex items-center gap-2">
                    <Icon name="material-symbols:mail-rounded" />
                    <span class="font-medium">aiengcenter@kmitl.ac.th</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const userInfo = useState("userInfo");
const adminInfo = useState("adminInfo");
const route = useRoute();

const displayName = computed(() => {
    if (route.path.startsWith("/auth")) {
        return userInfo.value?.name || "User";
    } else if (route.path.startsWith("/administrator")) {
        return adminInfo.value?.email || "Admin";
    } else {
        return "404 Not Found";
    }
});

// watchEffect(() => {
//     if (
//         !route.path.startsWith("/auth") &&
//         !route.path.startsWith("/administrator")
//     ) {
//         router.replace("/404");
//     }
// });

async function logout() {
    if (route.path.startsWith("/auth")) {
        localStorage.removeItem("auth_token");
        navigateTo("/");
        userInfo.value = null;
    } else if (route.path.startsWith("/administrator")) {
        localStorage.removeItem("admin_token");
        navigateTo("/administrator");
        adminInfo.value = null;
    }
}

import { provide, ref } from "vue";

const backTo = ref(null);
provide("backTo", backTo);
provide("updateBackTo", (newValue) => {
    backTo.value = newValue;
});
</script>
