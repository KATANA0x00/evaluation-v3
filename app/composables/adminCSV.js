import Papa from "papaparse";

export function adminCSV() {
    function generateTemplate() {
        const columns = ["name", "email", "progress", "approved"]; // removed ticked

        for (let i = 1; i <= 7; i++) {
            columns.push(`skill#${i}`);
        }

        const csvContent = columns.join(",");
        const csvWithBOM = "\uFEFF" + csvContent;

        const blob = new Blob([csvWithBOM], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "template.csv";
        link.click();

        URL.revokeObjectURL(url);
    }

    function parseCsvFile(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const rows = results.data;

                    const fixedColumns = [
                        "name",
                        "email",
                        "progress",
                        "approved",
                    ];

                    // อ่าน skill columns ทั้งหมดที่เหลือจาก header
                    const skillColumns = results.meta.fields.filter(
                        (h) => !fixedColumns.includes(h)
                    );

                    const data = [];

                    const cleanProgress = (v) => {
                        if (!v) return 0;
                        return Number(String(v).replace("%", "").trim());
                    };

                    const cleanApproved = (v) => {
                        const str = String(v).trim().toLowerCase();
                        if (str === "true") return true;
                        if (str === "false") return false;
                        return false;
                    };

                    for (let row of rows) {
                        const obj = {
                            email: row["email"] || "",
                            name: row["name"] || "",
                            approved: cleanApproved(row["approved"]),
                            progress: cleanProgress(row["progress"]),
                            skill: [],
                        };

                        for (let col of skillColumns) {
                            obj.skill.push({
                                skill: col,
                                level: Number(row[col] || 0),
                            });
                        }

                        data.push(obj);
                    }

                    resolve({
                        data,
                        skillList: skillColumns,
                        peopleCount: data.length,
                        skillCount: skillColumns.length,
                    });
                },
                error: (err) => reject(err),
            });
        });
    }

    return {
        generateTemplate,
        parseCsvFile,
    };
}
