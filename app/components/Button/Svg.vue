<template>
    <button class="flex items-center justify-center gap-1 px-2 py-1" :class="responive ? 'aspect-square md:aspect-auto' : undefined">
        <Icon :name="name"/>
        <span :class="responive ? 'hidden md:inline' : undefined">
            <slot></slot>
        </span>
    </button>
</template>

<script setup>
const porps = defineProps({
    name: {
        type: String,
    },
    responive: {
        type: Boolean,
        default: false
    }
});
</script>
