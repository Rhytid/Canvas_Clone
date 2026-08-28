import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel
} from "docx";

import type { Assign } from "./Assignment-Components/Dashboard";

//ChatGPT was used to help generate this code
export async function exportAssignToDocx(assign: Assign) {
    const title = assign.Title.trim() || "Untitled_Assignment";

    const children: Paragraph[] = [];

    children.push(
        new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE
        })
    );

    children.push(
        new Paragraph({
            children: [
                new TextRun({ text: "Due Date: ", bold: true }),
                new TextRun({ text: assign.dueDate ? assign.dueDate.toLocaleString() : "N/A" })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Total Points: ", bold: true }),
                new TextRun({ text: assign.Totalpoints.toString() })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Attempts Allowed: ", bold: true }),
                new TextRun({ text: assign.Attempts.toString() })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Published: ", bold: true }),
                new TextRun({ text: assign.Published ? "Yes" : "No" })
            ]
        }),
        new Paragraph("")
    );

    if (assign.description) {
        children.push(
            new Paragraph({
                text: "Description",
                heading: HeadingLevel.HEADING_1
            }),
            new Paragraph(assign.description),
            new Paragraph("")
        );
    }

    assign.Questions.forEach((q, index) => {
        if (q.Type === "PageBreak") {
            children.push(new Paragraph({ pageBreakBefore: true }));
            return;
        }

        children.push(
            new Paragraph({
                text: `Question ${index + 1}: ` + q.Type, 
                heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: q.Question, bold: true })
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Points: ", bold: true }),
                    new TextRun({ text: q.Points.toString() })
                ]
            })
        );

        if (q.Answers.length) {
            q.Answers.forEach((a, i) => {
                children.push(
                    new Paragraph({
                        text: `${String.fromCharCode(65 + i)}. ${a}`
                    })
                );
            });
        }

        
    });

    /* ---------- CREATE DOC ---------- */
    const doc = new Document({
        sections: [
            {
                children
            }
        ]
    });

    const blob = await Packer.toBlob(doc);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.docx`;
    link.click();

    URL.revokeObjectURL(link.href);
}
