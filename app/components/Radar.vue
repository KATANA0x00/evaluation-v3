<template>
    <div
        class="relative w-full h-full aspect-square flex items-center justify-center"
    >
        <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import {
    Chart,
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { debounce } from "lodash-es";

Chart.register(
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

// Use props for reactive input
const props = defineProps({
    scores: {
        type: Array,
        default: () => [],
    },
    level: {
        type: Number,
        default: 6,
    },
});

// ⭐ ADDED — color palette for multi rings
const ringColors = [
    { bg: "#FF880025", border: "#FF8800" },
    { bg: "#20D89725", border: "#20D897" },
    { bg: "#26A5FF25", border: "#26A5FF" },
    { bg: "#CB9DF025", border: "#CB9DF0" },
    { bg: "#FF90BB25", border: "#FF90BB" },
    { bg: "#B17F5925", border: "#B17F59" },
];

const canvas = ref(null);
let chartInstance = null;

function createRadarChart() {
    if (!canvas.value) return;
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;

    // ⭐ CHANGED — Support multi-ring (multi datasets)
    const isMulti = Array.isArray(props.scores[0]);

    const labels = (isMulti ? props.scores[0] : props.scores).map((item) =>
        wrapLabel(item.skill || "Item", 12)
    );

    // ⭐ UPDATED — apply ringColors by dataset index
    const datasets = (isMulti ? props.scores : [props.scores]).map(
        (set, index) => {
            const color = ringColors[index % ringColors.length]; // safe loop

            return {
                label: `Set ${index + 1}`,
                data: set.map((item) => item.level),
                backgroundColor: color.bg,
                borderColor: color.border,
                borderWidth: 2,
                pointBackgroundColor: color.border,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: color.border,
            };
        }
    );

    const width = canvas.value.parentElement.clientWidth;
    const fontSize = width < 400 ? 10 : width < 700 ? 14 : 20;

    chartInstance = new Chart(ctx, {
        type: "radar",
        data: {
            labels,
            datasets: datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: props.level,
                    ticks: { stepSize: 1, color: "#e35205" },
                    grid: { color: "#e35205" },
                    angleLines: { color: "#e35205" },
                    pointLabels: {
                        color: "#e35205",
                        font: { size: fontSize, weight: "500" },
                        // callback: (label) => {
                        //   const maxLen = width < 400 ? 6 : 10;
                        //   return label.length > maxLen ? label.slice(0, maxLen) + "…" : label;
                        // },
                    },
                },
            },
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
        },
    });
}

const handleResize = debounce(() => {
    createRadarChart();
}, 300);

watch(
    () => props.scores,
    () => createRadarChart(),
    { deep: true }
);

onMounted(() => {
    createRadarChart();
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
    if (chartInstance) chartInstance.destroy();
});

function wrapLabel(text, maxLen) {
    const words = text.split(" ");
    const lines = [];
    let current = "";

    for (const w of words) {
        if ((current + " " + w).trim().length > maxLen) {
            lines.push(current.trim());
            current = w;
        } else {
            current += " " + w;
        }
    }
    if (current) lines.push(current.trim());
    return lines;
}
</script>
