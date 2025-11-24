<template>
    <div class="flex flex-col px-2">
        <div class="flex justify-between items-center">
            <span class="font-bold text-3xl/16 text-(--orange-base)"
                >เพิ่มโครงการ</span
            >
            <div class="flex gap-2 py-2">
                <ButtonSvg
                    name="material-symbols:close-rounded"
                    class="border-2 border-red-400 hover:text-red-400 bg-red-400 hover:bg-(--white-base) text-(--text-white) px-4 py-2 rounded-md md:w-24"
                    responive
                    @click="navigateTo(`/administrator/course/shelf`)"
                    >ยกเลิก</ButtonSvg
                >
                <ButtonSvg
                    name="material-symbols:check-rounded"
                    class="border-2 border-green-500 hover:text-green-500 bg-green-500 hover:bg-(--white-base) text-(--text-white) px-4 py-2 rounded-md md:w-24"
                    @click="submitAddUser"
                    responive
                    >ยืนยัน</ButtonSvg
                >
            </div>
        </div>
        <Block class="items-start lg:w-[50%]">
            <div
                class="w-full text-base grid grid-cols-1 md:grid-cols-[3fr_1fr] md:gap-3"
            >
                <InputLabel
                    label="ชื่อโครงการ"
                    placeHolder="ชื่อโครงการ"
                    v-model:modelValue="course_name"
                    required
                />
                <InputLabel
                    label="รอบที่"
                    placeHolder="รอบโครงการ"
                    v-model:modelValue="course_number"
                    required
                />
            </div>
        </Block>
        <br />
        <Block class="items-start lg:w-[50%]">
            <div class="px-2 lg:px-4 pb-5">
                <span class="text-base">จัดการข้อมูล</span>
                <div class="flex gap-2 py-2">
                    <ButtonSvg
                        name="line-md:download-outline-loop"
                        class="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-(--text-white) px-4 py-2 rounded-md w-28"
                        @click="generateTemplate"
                        >Template</ButtonSvg
                    >
                    <input
                        type="file"
                        accept=".csv"
                        class="hidden"
                        ref="csvInput"
                        @change="handleUpload"
                    />
                    <ButtonSvg
                        name="line-md:upload-outline-loop"
                        class="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-(--text-white) px-4 py-2 rounded-md w-28"
                        @click="$refs.csvInput.click()"
                        >Upload</ButtonSvg
                    >
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:gap-5 text-xl">
                <div class="flex items-center gap-1">
                    <Icon name="ic:sharp-people-alt" />
                    <span>จำนวนผู้เรียน {{ studentCount }} คน</span>
                </div>
                <div class="flex items-center gap-1">
                    <Icon name="material-symbols:bookmark-added-rounded" />
                    <span>จำนวนทักษะ {{ skillsCount }}</span>
                </div>
            </div>
        </Block>
    </div>
</template>

<script setup>
const course_name = ref("");
const course_number = ref("");
const skillsList = ref([]);

const { generateTemplate, parseCsvFile } = adminCSV();

const studentsList = ref([]);
const studentCount = ref(0);
const skillsCount = ref(0);
function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    parseCsvFile(file).then(({ data, skillList, peopleCount, skillCount }) => {
        studentsList.value = data;
        skillsList.value = skillList;
        studentCount.value = peopleCount;
        skillsCount.value = skillCount;
    });
}

const config = useRuntimeConfig();
async function submitAddUser() {
    const res = await $fetch(
        `${config.public.apiUrl}/database/admin/create/course`,{
            method: 'POST',
            body: {
                courseName: course_name.value,
                courseNumber: course_number.value,
                skillsList: skillsList.value
            }
        }
    )
    if(!res.success) return;
        const response = await $fetch(
        `${config.public.apiUrl}/database/admin/create/user?course_id=${res.courseId}`,{
            method: 'POST',
            body: {
                studentList: studentsList.value
            }
        }
    );
    if (response.success) {
        navigateTo('/administrator/course/shelf')
    }
}
</script>
