<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 place-items-center">
        <block
            class="aspect-square w-full max-w-[90%] flex flex-col overflow-hidden"
            ><img v-if="previewUrl" :src="previewUrl"
        /></block>
        <div class="self-start flex flex-col">
            <ButtonSvg
                v-if="previewUrl"
                @click="download('pdf')"
                name="streamline-flex:pdf-reader-application-remix"
                class="text-(--text-white) bg-[#FF383C] px-5 py-2 rounded-md my-2"
            >
                Download PDF
            </ButtonSvg>
            <ButtonSvg
                v-if="previewUrl"
                @click="download('png')"
                name="material-symbols:photo-library-outline-rounded"
                class="text-(--text-white) bg-[#0088FF] px-5 py-2 rounded-md my-2"
            >
                Download PNG
            </ButtonSvg>
        </div>
    </div>
</template>

<script setup>
useHead({
    title: "Certificate",
});

definePageMeta({
    layout: "default",
});

const route = useRoute();
const userInfo = useState("userInfo", () => ({
    user_id: null,
    email: null,
    name: null,
}));
const config = useRuntimeConfig();

const datas = ref();
const previewUrl = ref("");

// Fetch transcript/course data and generate preview automatically
watchEffect(async () => {
    if (!userInfo.value?.user_id || !route.query.course_id) return;
    const response = await $fetch(
        `${config.public.apiUrl}/database/transcript?course_id=${route.query.course_id}&user_id=${userInfo.value.user_id}`
    );

    if (response.success) {
        datas.value = response.datas;

        // Generate preview automatically
        const res = await $fetch("/api/database/certificate", {
            method: "POST",
            body: {
                name: userInfo.value.name,
                course: datas.value.name,
                type: "png",
            },
            responseType: "blob",
        });

        previewUrl.value = URL.createObjectURL(res);
    }
});

// Download function
const download = async (type = "pdf") => {
    if (!datas.value) return;

    const res = await $fetch("/api/database/certificate", {
        method: "POST",
        body: {
            name: userInfo.value.name,
            course: datas.value.name,
            type,
        },
        responseType: "blob",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(res);
    link.download = `certificate.${type}`;
    link.click();
};

const updateBackTo = inject('updateBackTo');
onMounted(() => {
  updateBackTo(`/auth/transcript?course_id=${route.query.course_id}`);
});

watch(
    datas,
    (newVal) => {
        if (!newVal) return;
        if (!newVal.approved && (newVal.progess ?? 0) < 80) {
            navigateTo(`/auth/transcript?course_id=${route.query.course_id}`)
        }
    },
    { immediate: true }
);
</script>
