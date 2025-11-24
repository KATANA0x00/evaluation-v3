<template>
        <Block class="w-auto max-w-[85%] min-w-[85%] md:min-w-[70%] lg:min-w-[40%] 2xl:min-w-[30%]" dotSize="1.1rem">
            <div
                v-if="isLoading"
                class="bg-(--white-shift)/40 w-full h-full absolute z-1 flex items-center justify-center"
            >
                <Icon
                    name="line-md:loading-twotone-loop"
                    class="text-(--text-mid)"
                    size="15rem"
                />
            </div>
            <ScrambleText
                :text="workingMode.textMode"
                class="font-bold text-3xl"
            />
            <HideContainer :mode="workingMode.textMode === 'LOGIN'" :min="10">
                <form @submit.prevent="authentication">
                    <InputLabel
                        label="E-mail"
                        placeHolder="E-mail Address"
                        v-model:modelValue="email"
                        email
                        required
                    />
                    <InputLabel
                        label="Password"
                        placeHolder="Password"
                        v-model:modelValue="password"
                        password
                        required
                    />
                    <span
                        class="font-normal text-xs pl-2 pt-2 w-full"
                        :class="isSuccess ? 'text-green-500' : 'text-red-600'"
                    >
                        {{ responseMessage || "\u00A0" }}
                    </span>
                    <div
                        class="w-full flex justify-between items-center pt-2 pb-8"
                    >
                        <span
                            class="underline font-normal text-xs ml-2 cursor-pointer! hover:text-(--orange-base)"
                            @click="workingMode = mode[2]"
                            >forget password ?</span
                        >
                        <button
                            class="relative px-5 py-2 bg-(--orange-base) text-(--text-white) font-bold text-xl rounded-md flex justify-center items-center gap-2 overflow-hidden transition-all duration-300 group"
                            type="submit"
                        >
                            <span
                                class="smooth-trans group-hover:-translate-x-3"
                            >
                                LOGIN
                            </span>

                            <Icon
                                name="ic:round-double-arrow"
                                size="1.7rem"
                                class="absolute right-0 translate-x-full smooth-trans duration-200! group-hover:-translate-x-1"
                            />
                        </button>
                    </div>
                </form>
            </HideContainer>

            <HideContainer :mode="workingMode.textMode !== 'LOGIN'" class="mb-5">
                <div class="flex items-center justify-center gap-1 font-normal text-xs">
                    <span>Already a member?</span>
                    <span class="underline cursor-pointer! hover:text-(--orange-base)" @click="workingMode = mode[0]">Login here</span>
                </div>
            </HideContainer>

            <Breakline>OR</Breakline>

            <InputButton
                :label="
                    workingMode.textMode === 'LOGIN'
                        ? 'Request Password'
                        : 'E-mail that you registered'
                "
                placeHolder="Enter the E-mail that you registered."
                @focus="
                    workingMode.textMode === 'LOGIN'
                        ? (workingMode = mode[1])
                        : workingMode
                "
                @btnclick="workingMode.activeFunc"
                v-model:modelValue="registeringEmail"
                email
            />

            <HideContainer
                :mode="workingMode.textMode !== 'LOGIN'"
                class="mt-2"
            >
                <span
                    class="font-normal text-xs pl-2 pt-2 w-full"
                    :class="isSuccess ? 'text-green-500' : 'text-red-600'"
                >
                    {{ responseMessage || "\u00A0" }}
                </span>
                <div
                    v-for="value in workingMode.tipList || ['\u00A0','\u00A0','\u00A0']"
                    class="grid grid-cols-[auto_1fr] items-center mt-2 sm:mt-5 w-80 md:w-full"
                >
                    <Icon
                        name="material-symbols:circle-circle"
                        class="text-(--orange-base) mx-2 aspect-square"
                        size="1rem"
                    />
                    <span class="text-wrap">{{ value }}</span>
                </div>
            </HideContainer>
            <br />
        </Block>
</template>

<script setup>
useHead({
    title: "AIML certification",
});

definePageMeta({
    layout: "empty",
});

const mode = [
    { textMode: "LOGIN" },
    {
        textMode: "REGISTER",
        tipList: [
            "Enter the E-mail that you registered.",
            "Check your inbox for the confirmation and password.",
            "Return to the login page to access your account.",
        ],
        activeFunc: password_request,
    },
    {
        textMode: "FORGET PASSWORD",
        tipList: [
            "Enter the E-mail that you registered.",
            "Check your inbox and click the link to get a new password.",
            "Return to the login page and log in with your new password.",
        ],
        activeFunc: password_reset,
    },
];
const workingMode = ref(mode[0]);

// ---------- INFOMATION ---------- //
const email = ref("");
const password = ref("");
const registeringEmail = ref("");

const isSuccess = ref(false);
const isLoading = ref(false);
const responseMessage = ref(null);

const config = useRuntimeConfig();
async function authentication() {
    isLoading.value = true;
    const response = await $fetch(
        `${config.public.apiUrl}/authentication/login`,
        {
            method: "POST",
            body: {
                email: email.value,
                password: password.value,
            },
        }
    );
    if (!response) {
        responseMessage.value = "Server error";
    }
    if (response?.success) {
        localStorage.setItem("auth_token", response.token);
        isSuccess.value = true;
    } else {
        isSuccess.value = false;
    }
    responseMessage.value = response.message;
    isLoading.value = false;
    if(response?.success) {
        navigateTo('auth/shelf')
    }
}

async function password_request() {
    isLoading.value = true;
    const response = await $fetch(
        `${config.public.apiUrl}/authentication/psw`,
        {
            method: "POST",
            body: {
                email: registeringEmail.value,
            },
        }
    );

    if (!response) {
        responseMessage.value = "Server error";
    }
    if (response?.success) {
        isSuccess.value = true;
    } else {
        isSuccess.value = false;
    }
    responseMessage.value = response.message;
    isLoading.value = false;
}

async function password_reset() {
    isLoading.value = true;
    const response = await $fetch(
        `${config.public.apiUrl}/authentication/reset_psw`,
        {
            method: "POST",
            body: {
                email: registeringEmail.value,
            },
        }
    );

    if (!response) {
        responseMessage.value = "Server error";
    }
    if (response?.success) {
        isSuccess.value = true;
    } else {
        isSuccess.value = false;
    }
    responseMessage.value = response.message;
    isLoading.value = false;
}

watch(workingMode, () => {
    responseMessage.value = null;
    isSuccess.value = false;
    isLoading.value = false;
});
</script>
