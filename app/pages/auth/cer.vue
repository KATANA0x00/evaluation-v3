<template>
    <div class="flex gap-4">
        <!-- Preview -->
        <div ref="certificate" class="certificate-template relative">
            <img
                src="/certificate-background.png"
                alt="Template"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <!-- Labels -->
            <div
                v-for="(label, index) in labels"
                :key="index"
                class="absolute cursor-move"
                :style="{
                    top: label.y + 'px',
                    left: label.x + 'px',
                    fontSize: label.fontSize + 'px',
                }"
                @mousedown="startDrag(index, $event)"
            >
                {{ label.text }}
            </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-col gap-2">
            <button @click="downloadPDF">Download PDF</button>
            <button @click="downloadImage('jpeg')">Download JPEG</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import html2canvas from "html2canvas";

const certificate = ref(null);

// Example labels with coordinates
const labels = reactive([
    { text: "John Doe", x: 200, y: 200, fontSize: 24 },
    { text: "AI Course", x: 200, y: 250, fontSize: 18 },
]);

let dragging = null;
let offset = { x: 0, y: 0 };

const startDrag = (index, event) => {
    dragging = index;
    offset.x = event.clientX - labels[index].x;
    offset.y = event.clientY - labels[index].y;

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
};

const onDrag = (event) => {
    if (dragging !== null) {
        labels[dragging].x = event.clientX - offset.x;
        labels[dragging].y = event.clientY - offset.y;
    }
};

const stopDrag = () => {
    dragging = null;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
};

// Download as PDF (dynamic import for SSR safety)
const downloadPDF = async () => {
    const { default: jsPDF } = await import("jspdf"); // <-- dynamic import
    const canvas = await html2canvas(certificate.value);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("certificate.pdf");
};

// Download as Image
const downloadImage = async (type = "png") => {
    const canvas = await html2canvas(certificate.value);
    const link = document.createElement("a");
    link.download = `certificate.${type}`;
    link.href = canvas.toDataURL(`image/${type}`);
    link.click();
};
</script>

<style scoped>
.certificate-template {
    width: 800px;
    height: 600px;
    position: relative;
    border: 2px solid #333;
    background-color: #fff;
    overflow: hidden;
}
</style>
