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
        <ScrambleText text="ADMINISTRATION" class="font-bold text-3xl" />
        <HideContainer :mode="true" :min="10">
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
                <div class="w-full flex justify-between items-center pt-2 pb-8">
                    <div></div>
                    <button
                        class="relative px-5 py-2 bg-(--orange-base) text-(--text-white) font-bold text-xl rounded-md flex justify-center items-center gap-2 overflow-hidden transition-all duration-300 group"
                        type="submit"
                    >
                        <span class="smooth-trans group-hover:-translate-x-3">
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
    </Block>
</template>

<script setup>
useHead({
    title: "Administration",
});

definePageMeta({
    layout: "empty",
});

const isLoading = ref(false)
const isSuccess = ref(false)
const email = ref("");
const password = ref("");
const responseMessage = ref(null);

const config = useRuntimeConfig();
async function authentication() {
    isLoading.value = true;
    const response = await $fetch(
        `${config.public.apiUrl}/authentication/admin/login`,
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
        localStorage.setItem("admin_token", response.token);
        isSuccess.value = true;
    } else {
        isSuccess.value = false;
    }
    responseMessage.value = response.message;
    isLoading.value = false;

    if (response?.success) {
        navigateTo("/administrator/course/shelf")
    }
}
</script>
