<template>
    <div
        class="flex flex-col justify-center items-center px-8 py-5 md:px-15 md:py-10 border-2 rounded-xl relative smooth-trans"
        :style="{
            backgroundColor: 'var(--white-shift)',
            borderColor: currentColor,
            transition: hasHover ? 'border-color 0.1s ease' : 'none',
        }"
        @mouseenter="hasHover && (hovering = true)"
        @mouseleave="hasHover && (hovering = false)"
    >
        <slot></slot>

        <!-- Corner dots -->
        <div
            v-for="(pos, i) in cornerPositions"
            :key="i"
            class="absolute aspect-square rounded-full flex items-center justify-center"
            :class="pos"
        >
            <Icon
                name="material-symbols-light:circle"
                :size="dotSize"
                :style="{
                    backgroundColor: currentColor,
                    transition: hasHover
                        ? 'background-color 0.1s ease'
                        : 'none',
                }"
            />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    dotSize: {
        type: String,
        default: "0.7rem",
    },
    hoverColor: {
        type: String,
        default: "",
    },
    baseColor: {
        type: String,
        default: "var(--white-outline)",
    },
});

const hovering = ref(false);
const hasHover = computed(() => props.hoverColor.trim() !== "");

const cornerPositions = [
    "top-2 left-2",
    "top-2 right-2",
    "bottom-2 left-2",
    "bottom-2 right-2",
];

const currentColor = computed(() =>
    hasHover.value && hovering.value ? props.hoverColor : props.baseColor
);
</script>
