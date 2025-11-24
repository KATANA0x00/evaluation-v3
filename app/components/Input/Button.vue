<template>
    <div class="w-full flex flex-col">
        <ScrambleText
            :text="label"
            :speed="5"
            class="mt-4 mb-2 md:mt-5 md:mb-3 pl-2 lg:pl-4"
        />
        <div class="flex relative justify-center items-center">
            <form @submit.prevent="emit('btnclick')" class="contents">
                <input
                    :type="computedType"
                    class="w-full outline-none text-(--text-white) bg-(--text-black) h-12 px-3 md:px-5 rounded-md"
                    :placeholder="placeHolder"
                    @focus="emit('focus')"
                    v-model="modelValue"
                />
                <button
                    class="flex bg-(--orange-base) text-(--text-white) hover:bg-(--text-white) hover:text-(--orange-base) rounded-md aspect-square absolute justify-center items-center p-2 right-1 smooth-trans"
                    type="submit"
                >
                    <Icon name="solar:map-arrow-right-bold-duotone" size="1.5rem" />
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    placeHolder: {
        type: String,
        default: "",
    },
    email: { type: Boolean, default: false }
});
const emit = defineEmits(["focus","btnclick"]);
const modelValue = defineModel({
    type: String,
    required: true,
});

const computedType = computed(() => {
    if (props.email) return "email";
    return "text";
});
</script>
