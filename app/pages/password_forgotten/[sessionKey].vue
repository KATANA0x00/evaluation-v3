<template>
    <div class="flex justify-center items-center w-screen h-screen">
        <Block v-if="isLanding">
            <ScrambleText :text="responseMessage" class="font-bold text-3xl" />
            <br />
            <div
                class="grid grid-cols-[auto_1fr] items-center mt-2 sm:mt-5 w-80 md:w-full"
            >
                <Icon
                    name="material-symbols:circle-circle"
                    class="text-(--orange-base) mx-2 aspect-square"
                    size="1rem"
                />
                <span class="text-wrap"
                    >Please check your inbox and click the link to get a new
                    password.</span
                >
            </div>
            <div
                class="grid grid-cols-[auto_1fr] items-center mt-2 sm:mt-5 w-80 md:w-full"
            >
                <Icon
                    name="material-symbols:circle-circle"
                    class="text-(--orange-base) mx-2 aspect-square"
                    size="1rem"
                />
                <span class="text-wrap flex"
                    >Return to the &nbsp;
                    <NuxtLink
                        to="/"
                        class="text-(--text-mid) font-bold hover:text-(--orange-base) underline cursor-pointer flex items-center"
                        >login page<Icon name="quill:link-out" />
                    </NuxtLink>
                    &nbsp; and log in with your new password.</span
                >
            </div>
        </Block>

        <Block v-else>
            <ScrambleText text="ON Working..." class="font-bold text-3xl" />
            <Icon
                name="line-md:loading-twotone-loop"
                class="text-(--text-mid)"
                size="15rem"
            />
        </Block>
    </div>
</template>

<script setup>
useHead({
    title: "Password Reset",
});

definePageMeta({
    layout: "empty",
});

const isLanding = ref(false);
const route = useRoute();
const sessionKey = computed(() => route.params.sessionKey);
const config = useRuntimeConfig();
const responseMessage = ref("");

onMounted(async () => {
    try {
        const response = await $fetch(
            `${config.public.apiUrl}/authentication/valid_reset_psw`,
            {
                method: "POST",
                body: {
                    sessionKey: sessionKey.value,
                },
            }
        );

        responseMessage.value = response.message;
    } catch (err) {
        responseMessage.value = "Server error";
    } finally {
        isLanding.value = true;
    }
});
</script>
