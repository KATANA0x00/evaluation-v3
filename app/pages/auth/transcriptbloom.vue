<template>
    <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-5 place-items-center relative"
    >
        <block
            class="aspect-9/10 lg:aspect-square lg:w-[90%] w-full lg:order-2 flex flex-col overflow-hidden"
        >
            <!-- Sticky Header -->
            <div
                class="w-full border-b border-(--text-black) pb-1 md:pb-2 sticky top-0 z-10"
            >
                <div class="w-full flex justify-between items-center">
                    <span
                        class="font-bold text-base md:text-lg lg:text-xl text-(--orange-base)"
                        >ผลการเรียน</span
                    >
                    <ButtonSvg
                        v-if="datas"
                        name="mingcute:certificate-2-fill"
                        class="text-(--text-white) md:py-2 md:px-3 rounded-md"
                        :class="(datas?.approved && datas?.progress >= 80) ? 'bg-(--orange-base)' : 'bg-(--white-outline) cursor-default!'"
                        responive
                        @click="
                            watchable(datas?.approved && datas?.progress >= 80)
                        "
                        ><span class="cursor-default">Certificate</span></ButtonSvg
                    >
                </div>
                <div class="py-1">
                    <span class="font-bold text-xs md:text-base 2xl:text-xl">
                        {{ datas?.name || "-" }}
                    </span>
                </div>
            </div>
            <div
                class="w-full grid grid-cols-[2fr_1fr] md:grid-cols-[4fr_1fr] text-xs md:text-base 2xl:text-xl py-1"
            >
                <span>ทักษะ (Skill)</span>
            </div>
            <!-- Scrollable List -->
            <div class="flex-1 overflow-y-auto w-full">
                <div
                    class="w-full grid grid-cols-[2fr_1fr] md:grid-cols-[4fr_1fr] font-normal items-center pb-0.5 mb-2 border-b border-(--white-outline)"
                    v-for="value in rings"
                >
                    <span>{{ value }}</span>
                </div>
            </div>
        </block>

        <block
            class="aspect-9/10 lg:aspect-square lg:w-[90%] w-full lg:order-1 mb-5 lg:mb-0"
        >
            <span class="font-bold text-base md:text-lg lg:text-xl"
                >Skill Chart</span
            >
            <div class="w-full lg:w-[80%]">
                <Radar :scores="datas?.scores" :level="levelShow"/>
            </div>
            <!-- <div
                class="w-full grid grid-cols-2 font-normal text-[7px] md:text-xs text-center mb-5 gap-y-1"
            >
                <span>ระดับ 1 : Remembering (การจดจำ)</span>
                <span>ระดับ 2 : Understanding (การเข้าใจ)</span>
                <span>ระดับ 3 : Applying (การประยุกต์ใช้)</span>
                <span>ระดับ 4 : Analyzing (การวิเคราะห์)</span>
                <span>ระดับ 5 : Evaluating (การประเมินค่า)</span>
                <span>ระดับ 6 : Creating (การสร้างสรรค์)</span>
            </div> -->
        </block>
    </div>
</template>

<script setup>
useHead({
    title: "Transcript",
});

definePageMeta({
    layout: "default",
});
const route = useRoute();
const userInfo = useState("userInfo", () => ({
    user_id: null,
    email: null,
}));
const config = useRuntimeConfig();
const datas = ref();
const levelShow = ref(6)
const rings = ref([])
watchEffect(async () => {
    if (!userInfo.value?.user_id) return;

    const response = await $fetch(
        `${config.public.apiUrl}/database/transcript?course_id=${route.query.course_id}&user_id=${userInfo.value.user_id}`
    );

    if (response.success) {
        datas.value = response.datas;
        if(response.level){
            levelShow.value = response.level
        }
        if(response.rings){
            rings.value = response.rings
        }
        console.log(datas.value.scores)
    }
});

const updateBackTo = inject("updateBackTo");
onMounted(() => {
    updateBackTo("/auth/shelf");
});

const isAlert = ref(false);
function watchable(watchable) {
    if(!watchable){
        isAlert.value = true
        return
    }
    navigateTo(`/auth/certificate?course_id=${route.query.course_id}`);
}
</script>
