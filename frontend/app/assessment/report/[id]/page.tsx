"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReport } from "../../../lib/api";

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] =
    useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getReport(
          id as string
        );
        setReport(res.data);
      } catch (err: any) {
        alert(err.message);
      }
    }

    load();
  }, [id]);

  if (!report) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Final Assessment Report</h1>

      <p>
        Residual Score:{" "}
        {report.assessment.residual_score}
      </p>

      <h2>Executive Summary</h2>
      <p>{report.executive_summary}</p>

      <h2>Auditor Summary</h2>
      <p>
        {report.assessment.auditor_summary}
      </p>

      <h2>Function Results</h2>
      {report.functions.map(
        (f: any) => (
          <div key={f.id}>
            {f.function_id} —{" "}
            {f.risk_tier}
          </div>
        )
      )}
    </div>
  );
}