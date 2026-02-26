"use client";

export async function exportAuditPDF() {
  if (typeof window === "undefined") return;

  const jsPDF = (await import("jspdf")).default;
  const html2canvas = (await import("html2canvas")).default;

  const element = document.getElementById("audit-report");
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`audit-report-${Date.now()}.pdf`);
}

/* ===========================
   ASSESSMENT RESULT PDF
=========================== */

interface AssessmentPDFData {
  maturityScore: number | string;
  residualScore: number | string;
  riskTier: string;
  summary: string;
  periodStart?: string;
  periodEnd?: string;
  organizationName?: string;
}

export async function exportAssessmentPDF(data: AssessmentPDFData) {
  if (typeof window === "undefined") return;

  const jsPDF = (await import("jspdf")).default;
  const pdf = new jsPDF("p", "mm", "a4");

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const maturity = Number(data.maturityScore);
  const residual = Number(data.residualScore);
  const controlEffectiveness = ((maturity / 5) * 100).toFixed(1);

  // ── Helper: auto-paging ──
  function checkPage(needed: number) {
    if (y + needed > pageH - margin) {
      pdf.addPage();
      y = margin;
    }
  }

  // ── Header background bar ──
  pdf.setFillColor(17, 24, 39); // dark-900
  pdf.rect(0, 0, pageW, 45, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("CYBER RISK ASSESSMENT REPORT", pageW / 2, 20, { align: "center" });

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  pdf.text(`Generated: ${generatedDate}`, pageW / 2, 32, { align: "center" });

  if (data.periodStart && data.periodEnd) {
    pdf.text(
      `Assessment Period: ${data.periodStart} to ${data.periodEnd}`,
      pageW / 2,
      39,
      { align: "center" }
    );
  }

  y = 55;
  pdf.setTextColor(0, 0, 0);

  // ── Organization ──
  if (data.organizationName) {
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Organization: ${data.organizationName}`, margin, y);
    y += 10;
  }

  // ── Divider ──
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Score Cards ──
  const cardW = (contentW - 10) / 3;
  const cardH = 30;

  // Risk tier color
  function tierColor(tier: string): [number, number, number] {
    switch (tier.toUpperCase()) {
      case "LOW":
        return [34, 197, 94];
      case "MEDIUM":
        return [234, 179, 8];
      case "HIGH":
        return [249, 115, 22];
      case "CRITICAL":
        return [239, 68, 68];
      default:
        return [156, 163, 175];
    }
  }

  // Card 1: Maturity Score
  pdf.setFillColor(243, 244, 246);
  pdf.roundedRect(margin, y, cardW, cardH, 3, 3, "F");
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(107, 114, 128);
  pdf.text("Maturity Score (1-5)", margin + cardW / 2, y + 10, { align: "center" });
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(17, 24, 39);
  pdf.text(maturity.toFixed(2), margin + cardW / 2, y + 24, { align: "center" });

  // Card 2: Residual Risk
  const card2X = margin + cardW + 5;
  pdf.setFillColor(243, 244, 246);
  pdf.roundedRect(card2X, y, cardW, cardH, 3, 3, "F");
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(107, 114, 128);
  pdf.text("Residual Risk Score", card2X + cardW / 2, y + 10, { align: "center" });
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(17, 24, 39);
  pdf.text(residual.toFixed(2), card2X + cardW / 2, y + 24, { align: "center" });

  // Card 3: Risk Tier
  const card3X = margin + (cardW + 5) * 2;
  const [tr, tg, tb] = tierColor(data.riskTier);
  pdf.setFillColor(tr, tg, tb);
  pdf.roundedRect(card3X, y, cardW, cardH, 3, 3, "F");
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(255, 255, 255);
  pdf.text("Risk Tier", card3X + cardW / 2, y + 10, { align: "center" });
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.riskTier.toUpperCase(), card3X + cardW / 2, y + 24, { align: "center" });

  y += cardH + 12;

  // ── Control Effectiveness bar ──
  checkPage(25);
  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Control Effectiveness", margin, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`${controlEffectiveness}%`, margin + contentW - 2, y, { align: "right" });
  y += 5;

  // Background track
  pdf.setFillColor(229, 231, 235);
  pdf.roundedRect(margin, y, contentW, 6, 3, 3, "F");

  // Filled portion
  const fillW = Math.min((maturity / 5) * contentW, contentW);
  const barColor = maturity >= 3.5 ? [34, 197, 94] : maturity >= 2.5 ? [234, 179, 8] : [249, 115, 22];
  pdf.setFillColor(barColor[0], barColor[1], barColor[2]);
  pdf.roundedRect(margin, y, fillW, 6, 3, 3, "F");
  y += 14;

  // ── Divider ──
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Interpretation ──
  checkPage(30);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(17, 24, 39);
  pdf.text("Interpretation", margin, y);
  y += 7;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(55, 65, 81);

  const interpretation = `Based on the calculated maturity and residual exposure, the organization currently operates within the ${data.riskTier.toUpperCase()} risk band. Higher maturity reduces residual exposure. Current control effectiveness indicates ${controlEffectiveness}% control strength.`;

  const intLines = pdf.splitTextToSize(interpretation, contentW);
  for (const line of intLines) {
    checkPage(6);
    pdf.text(line, margin, y);
    y += 5.5;
  }
  y += 6;

  // ── AI Reasoning / Summary ──
  if (data.summary) {
    checkPage(20);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageW - margin, y);
    y += 8;

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(17, 24, 39);
    pdf.text("AI Risk Analysis", margin, y);
    y += 8;

    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(55, 65, 81);

    const summaryLines = pdf.splitTextToSize(data.summary, contentW);
    for (const line of summaryLines) {
      checkPage(5.5);
      pdf.text(line, margin, y);
      y += 5;
    }
    y += 6;
  }

  // ── Recommendations ──
  checkPage(25);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, y, pageW - margin, y);
  y += 8;

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(17, 24, 39);
  pdf.text("Recommendations", margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(55, 65, 81);

  const recommendations = [
    "Improve weakest maturity domains to raise overall control effectiveness.",
    "Reduce inherent risk exposure through targeted mitigation strategies.",
    "Strengthen governance oversight and review processes.",
    "Conduct periodic reassessments to track progress over time.",
    "Align security investments with highest-risk areas identified.",
  ];

  for (const rec of recommendations) {
    checkPage(7);
    pdf.text(`•  ${rec}`, margin + 2, y);
    y += 6.5;
  }

  // ── Footer ──
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      `Cyber Risk Assessment Report — Page ${i} of ${totalPages}`,
      pageW / 2,
      pageH - 10,
      { align: "center" }
    );
  }

  const fileName = data.organizationName
    ? `risk-assessment-${data.organizationName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`
    : `risk-assessment-${Date.now()}.pdf`;

  pdf.save(fileName);
}