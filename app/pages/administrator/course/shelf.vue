<template>
    <div>
        <div class="w-full flex gap-1 items-center justify-end mb-5">
            <div
                class="flex items-center self-stretch grow md:max-w-80 border border-(--thext-black) bg-(--white-shift) rounded-sm relative"
            >
                <Icon name="solar:magnifer-outline" class="px-3" />
                <input
                    type="text"
                    class="outline-none self-stretch grow"
                    v-model="filterText"
                />
            </div>

            <!-- <ButtonSvg
                class="text-(--text-black) hover:text-(--text-white) bg-(--white-shift) hover:bg-(--text-black) border border-(--text-black) rounded-sm smooth-trans"
                name="material-symbols:filter-list"
                responive
                >Filter</ButtonSvg
            > -->
            <ButtonSvg
                class="text-(--text-black) hover:text-(--text-white) bg-(--white-shift) hover:bg-(--text-black) border border-(--text-black) rounded-sm smooth-trans self-stretch"
                name="material-symbols:add"
                @click="
                    navigateTo(
                        `/administrator/course/create_course`
                    )
                "
                >New ourses</ButtonSvg
            >
        </div>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5">
            <CourseCard
                v-for="value in filteredCourseList"
                class="cursor-pointer"
                admin
                @click="
                    navigateTo(
                        `/administrator/course/detail?course_id=${value.id}`
                    )
                "
                >{{ value.name }}{{ " #" + value.number }}</CourseCard
            >
        </div>
    </div>
</template>

<script setup>
useHead({
    title: "Administration | Course shelf",
});

definePageMeta({
    layout: "default",
});

const adminInfo = useState("adminInfo");
const config = useRuntimeConfig();

const courseList = ref([]);
const response = await $fetch(
    `${config.public.apiUrl}/database/admin/course_shelf`
);
if (response.success) {
    courseList.value = response.courseList;
}

const filterText = ref("");

const filteredCourseList = computed(() => {
    return courseList.value.filter(
        (course) =>
            course.name
                .toLowerCase()
                .includes(filterText.value.toLowerCase()) ||
            course.number
                .toString()
                .toLowerCase()
                .includes(filterText.value.toLowerCase())
    );
});
</script>
