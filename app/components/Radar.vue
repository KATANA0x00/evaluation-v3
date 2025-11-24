<template>
  <div class="relative w-full h-full aspect-square flex items-center justify-center">
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
});

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

  const labels = props.scores.map((item) => wrapLabel(item.skill || "Item", 12));
  const dataValues = props.scores.map((item) => item.level);

  const width = canvas.value.parentElement.clientWidth;
  const fontSize = width < 400 ? 10 : width < 700 ? 14 : 20;

  chartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Student Scores",
          data: dataValues,
          backgroundColor: "rgba(245, 73, 39, 0.4)",
          borderColor: "#e35205",
          borderWidth: 2,
          pointBackgroundColor: "#e35205",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#e35205",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 6,
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
