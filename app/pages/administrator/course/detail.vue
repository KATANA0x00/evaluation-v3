<template>
    <div class="flex flex-col md:flex-row items-center w-full gap-3">
        <div class="flex items-center gap-3 w-full">
            <button
                @click="navigateTo('/administrator/course/shelf')"
                class="border-2 border-red-400 hover:text-red-400 bg-red-400 hover:bg-(--white-base) text-(--text-white) flex items-center justify-center aspect-square p-2 rounded-md"
            >
                <Icon name="mingcute:back-fill" size="1.2rem" />
            </button>
            <div class="flex w-full items-center">
                <input
                    v-model="datas.name"
                    type="text"
                    placeholder="ชื่อโครงการ"
                    class="w-full lg:w-[50%] outline-(--white-outline) text-(--text-black) bg-(--text-white) h-12 px-3 md:px-5 rounded-md"
                />
            </div>
        </div>
        <div class="flex gap-2 py-2 w-full md:w-fit justify-end">
            <!-- <ButtonSvg
                name="line-md:download-outline-loop"
                class="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-(--text-white) px-4 py-2 rounded-md w-28"
                @click="generateTemplate"
                >Template</ButtonSvg
            >
            <ButtonSvg
                name="line-md:upload-outline-loop"
                class="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-(--text-white) px-4 py-2 rounded-md w-28"
                >Upload</ButtonSvg
            > -->
            <button
                @click="saveCourse"
                class="border-2 border-green-500 hover:text-green-500 bg-green-500 hover:bg-(--white-base) text-(--text-white) flex items-center justify-center aspect-square p-2 rounded-md"
            >
                <Icon name="material-symbols:save" size="1.2rem" />
            </button>
        </div>
    </div>
    <div class="flex flex-col mt-5 relative">
        <div class="absolute z-10 w-full flex items-center">
            <button
                v-for="(item, index) in multipageList"
                class="w-full border-2 border-(--white-outline) border-b-0 rounded-t-xl py-3 font-semibold"
                :class="
                    selectedPage === index
                        ? 'bg-(--white-shift)'
                        : 'bg-(--white-outline)'
                "
                @click="selectedPage = index"
            >
                {{ item }}
            </button>
        </div>
        <div class="flex w-full pt-8 md:pt-5">
            <Block v-if="selectedPage === 0" class="w-full">
                <div
                    class="w-full lg:w-[80%] 2xl:w-[60%] grid grid-cols-[1fr_auto] py-3 font-medium"
                >
                    <span>ชื่อ</span>
                    <span>อนุญาติเข้าถึง</span>
                </div>
                <div
                    v-for="value in datas.students"
                    class="w-full lg:w-[80%] 2xl:w-[60%] grid grid-cols-[1fr_auto] mb-2 border-b-1 border-(--white-outline) hover:bg-(--white-outline) items-center"
                >
                    <div
                        class="grid grid-cols-1 lg:grid-cols-2 text-xs md:text-base"
                    >
                        <span class="font-semibold">{{ value.name }}</span>
                        <span class="truncate">{{ value.email }}</span>
                    </div>
                    <InputToggle
                        v-model="value.approved"
                        @click="saveApproved(value)"
                    />
                </div>
            </Block>
            <Block v-if="selectedPage === 1" class="w-full pt-10">
                <div
                    v-for="(value, idx) in datas.skill"
                    class="w-full mb-2 border-b-1 border-(--white-outline)"
                >
                    <span>{{ idx + 1 + ". " + value }}</span>
                </div>
            </Block>
        </div>
    </div>
</template>

<script setup>
useHead({
    title: "Administration | Course detail",
});

definePageMeta({
    layout: "default",
});

const { generateTemplate, parseCsvFile } = adminCSV();

const multipageList = ["รายชื่อผู้เรียน", "ทักษะ"];
const selectedPage = ref(0);

const config = useRuntimeConfig();
const route = useRoute();
const courseId = route.query.course_id;

const datas = ref({ name: "" });
const response = await $fetch(
    `${config.public.apiUrl}/database/admin/course_detail?course_id=${courseId}`
);
if (response.success) {
    datas.value = response.datas;
}

async function saveCourse() {
    const response = await $fetch(
        `${config.public.apiUrl}/database/admin/courseName`,
        {
            method: "POST",
            body: {
                name: datas.value.name,
                courseId,
            },
        }
    );
    if(response.success){
        navigateTo('/administrator/course/shelf')
    }
}

async function saveApproved(value) {
    await $fetch(`${config.public.apiUrl}/database/admin/approve`, {
        method: "POST",
        body: {
            approved: value.approved,
            userId: value.user_id,
            courseId,
        },
    });
}
</script>
