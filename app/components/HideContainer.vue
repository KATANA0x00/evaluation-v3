<template>
    <div
        ref="boxContainer"
        class="overflow-hidden transition-[max-height] duration-500! w-full"
        :style="{
            maxHeight: props.mode ? measuredMax + 'px' : props.min + 'px',
        }"
    >
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";

const props = defineProps({
    mode: { type: Boolean, default: false },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
});

const boxContainer = ref(null);
const measuredMax = ref(props.max);

onMounted(() => {
    if (!props.max && boxContainer.value) {
        measuredMax.value = boxContainer.value.scrollHeight;
    }
});

watch(
    () => props.mode,
    async () => {
        await nextTick();
        if (!props.max && boxContainer.value) {
            measuredMax.value = boxContainer.value.scrollHeight;
        }
    }
);
</script>
