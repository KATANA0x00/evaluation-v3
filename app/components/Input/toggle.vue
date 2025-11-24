<template>
    <button
        @click="toggle"
        class="border-2 border-(--text-mid) flex items-center justify-around rounded-md overflow-hidden w-fit h-fit"
    >
        <span
            class="aspect-square flex items-center justify-center p-1"
            :class="modelValue ? 'bg-green-500 text-(--text-white)' : 'bg-(--white-outline) text-(--text-mid)'"
            ><Icon name="material-symbols:check-rounded" size="1.2rem"
        /></span>
        <span
            class="aspect-square flex items-center justify-center p-1"
            :class="!modelValue ? 'bg-red-400 text-(--text-white)' : 'bg-(--white-outline) text-(--text-mid)'"
            ><Icon name="material-symbols:close-rounded" size="1.2rem"
        /></span>
    </button>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);

function toggle() {
    emit("update:modelValue", !props.modelValue);
}
</script>
