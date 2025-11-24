import path from "path";
import { createCanvas, loadImage, registerFont } from "canvas";
import { PDFDocument } from "pdf-lib";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { name, course, type = "pdf" } = body;

    // --- Register Thai Font ---
    const fontPath = path.resolve("./public/fonts/semibold.ttf");
    try {
        registerFont(fontPath, { family: "Sarabun" });
    } catch (e) {
        console.error("Failed to load font", e);
    }

    // Load certificate background
    const bgPath = path.resolve("./public/certificate-background.png");
    const bgImage = await loadImage(bgPath);

    // Set resolution
    const width = 1600;
    const height = 1200;

    // Create Canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(bgImage, 0, 0, width, height);

    // Add Name
    ctx.fillStyle = "#e35205";
    ctx.font = "bold 60px 'Sarabun'";
    ctx.textAlign = "center"; // center horizontally
    ctx.textBaseline = "middle"; // center vertically relative to y coordinate
    ctx.fillText(name || "-", width / 2, 400);

    // Add Course
    ctx.fillStyle = "#333";
    ctx.font = "bold 40px 'Sarabun'";
    ctx.textAlign = "center"; // center horizontally
    ctx.textBaseline = "middle";
    ctx.fillText(course || "-", width / 2, 600);

    // Return as PDF or Image
    if (type === "pdf") {
        const pdfDoc = await PDFDocument.create();
        const pdfPage = pdfDoc.addPage([width, height]);

        const pngBytes = canvas.toBuffer("image/png");
        const pngImage = await pdfDoc.embedPng(pngBytes);
        pdfPage.drawImage(pngImage, { x: 0, y: 0, width, height });

        const pdfBytes = await pdfDoc.save();

        event.node.res.setHeader("Content-Type", "application/pdf");
        event.node.res.setHeader(
            "Content-Disposition",
            `attachment; filename="certificate.pdf"`
        );

        return Buffer.from(pdfBytes);
    } else {
        event.node.res.setHeader("Content-Type", "image/png");
        event.node.res.setHeader(
            "Content-Disposition",
            `attachment; filename="certificate.png"`
        );

        return canvas.toBuffer("image/png");
    }
});
