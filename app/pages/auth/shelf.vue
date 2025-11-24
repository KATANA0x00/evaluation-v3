<template>
    <div>
        <!-- <div class="absolute inset-0 z-20 flex items-center justify-center">
            <Block>
                <span class="font-bold text-lg mb-2">คุณไม่สามารถเข้าถึงผลการเรียนนี้ได้</span>
                <span class="w-full">โปรดตรวจสอบ</span>
                <div class="w-full flex items-center mt-1">
                    <Icon
                        name="material-symbols:circle-circle"
                        class="text-(--orange-base) mx-2 aspect-square"
                        size="1rem"
                    />
                    <span class="text-wrap">ผลการเรียนเกิน 80%</span>
                </div>
                <div class="w-full flex items-center mt-1">
                    <Icon
                        name="material-symbols:circle-circle"
                        class="text-(--orange-base) mx-2 aspect-square"
                        size="1rem"
                    />
                    <span class="text-wrap">ผลการเรียนเกิน 80%</span>
                </div>
                <div class="w-full flex items-center mt-1">
                    <Icon
                        name="material-symbols:circle-circle"
                        class="text-(--orange-base) mx-2 aspect-square"
                        size="1rem"
                    />
                    <span class="text-wrap">ผลการเรียนเกิน 80%</span>
                </div>
            </Block>
        </div> -->
        <div class="w-full flex gap-1 items-center justify-end mb-5">
            <div
                class="flex items-center self-stretch grow md:max-w-80 border border-(--thext-black) bg-(--white-shift) rounded-sm relative"
            >
                <Icon name="solar:magnifer-outline" class="px-3" />
                <input type="text" class="outline-none self-stretch grow" v-model="filterText"/>
            </div>
            <ButtonSvg
                class="text-(--text-black) hover:text-(--text-white) bg-(--white-shift) hover:bg-(--text-black) border border-(--text-black) rounded-sm smooth-trans"
                name="solar:magnifer-outline"
                responive
                >Search</ButtonSvg>

            <!-- <ButtonSvg
                class="text-(--text-black) hover:text-(--text-white) bg-(--white-shift) hover:bg-(--text-black) border border-(--text-black) rounded-sm smooth-trans"
                name="material-symbols:filter-list"
                responive
                >Filter</ButtonSvg
            > -->
        </div>
        <div class="mb-5"><span class="font-bold text-base md:text-lg lg:text-xl">Enrolled Course</span></div>
        
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            <CourseCard
                v-for="value in filteredCourseList"
                :progress="value.progress"
                :watchable="true"
                class="cursor-pointer"
                @click="navigateTo(`/auth/transcript?course_id=${value.id}`)"
                >{{ value.name }}{{ " #"+value.number }}</CourseCard
            >
        </div>
    </div>
</template>

<script setup>
useHead({
    title: "Course shelf",
});

definePageMeta({
    layout: "default",
});

const userInfo = useState("userInfo", () => ({
    user_id: null,
    email: null,
}));
const config = useRuntimeConfig();
const courseList = ref([]);
onMounted(async () => {
    // Only fetch if user_id exists
    if (userInfo.value.user_id) {
        try {
            const response = await $fetch(
                `${config.public.apiUrl}/database/course_shelf?user_id=${userInfo.value.user_id}`
            );
            if (response.success) {
                courseList.value = response.courseList;
            }
        } catch (error) {
            console.error("Failed to fetch course list:", error);
        }
    }
});

const filterText = ref('')

const filteredCourseList = computed(() => {
    return courseList.value.filter(course =>
        course.name.toLowerCase().includes(filterText.value.toLowerCase()) ||
        course.number.toString().toLowerCase().includes(filterText.value.toLowerCase())
    )
})
</script>
