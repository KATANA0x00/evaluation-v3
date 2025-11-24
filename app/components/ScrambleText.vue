<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
    text: { type: String, default: "HELLO WORLD!" },
    speed: { type: Number, default: 10 },
    alphabet: {
        type: Array,
        default: () =>
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=/?<> ".split(""),
    },
    randomCycles: { type: Number, default: 4 },
});

const display = ref([]);
let index = 0;

function startAnimation() {
    index = 0;
    display.value = [...props.text].map(() => props.alphabet[Math.floor(Math.random() * props.alphabet.length)]);
    animateChar(0, 0);
}

function animateChar(pos, step = 0) {
    const target = props.text[pos];

    if (!target) return;

    if (step < props.randomCycles) {
        const randomChar =
            props.alphabet[Math.floor(Math.random() * props.alphabet.length)];
        display.value[pos] = randomChar;

        setTimeout(() => animateChar(pos, step + 1), props.speed);
    } else {
        display.value[pos] = target;
        index++;

        if (index < props.text.length) {
            animateChar(index, 0);
        }
    }
}

onMounted(startAnimation);

watch(
    () => props.text,
    () => {
        startAnimation();
    }
);
</script>

<template>
    <span>{{ display.join("") }}</span>
</template>
