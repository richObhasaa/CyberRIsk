"use client";

import ReactMarkdown from "react-markdown";
import { getScoreColor, getScoreLabel } from "../../lib/resultUtilsweb";


interface Props {
  data: any;
  email: string;
  onBack: () => void;
  onLogout: () => void;
}

export default function ResultUI({ data, email, onBack, onLogout }: Props) {
  const score = data.overallScore ?? 0;

  return (

    <div>
      <div>
        <span>{email}</span>
        <button onClick={onBack}>Back</button>
        <button onClick={onLogout}>Logout</button>
      </div>

      <h1>Audit Result</h1>

      <div id="audit-report">

        <section>
          <h2>Security Score</h2>
          <div>{score}%</div>
          <div>{getScoreLabel(score)}</div>
          <div>URL: {data.url}</div>
          <div>{new Date(data.timestamp).toLocaleString()}</div>
          {data.scoreExplanation && (
            <pre>{data.scoreExplanation}</pre>
          )}
        </section>

        {data.scoreBreakdown && (
          <section>
            <h2>Findings Breakdown (By Severity)</h2>
            {Object.entries(data.scoreBreakdown).map(([severity, info]: any) => (
              <div key={severity}>
                <div>{severity}</div>
                <div>{info.count} findings × {info.weight}</div>
                <div>-{info.points} points</div>
              </div>
            ))}
          </section>
        )}

        {data.aiSummary && (
          <section>
            <h2>AI Summary</h2>
            <ReactMarkdown>{data.aiSummary}</ReactMarkdown>
          </section>
        )}

        {data.findings?.length > 0 && (
          <section>
            <h2>Security Findings ({data.findings.length})</h2>
            {data.findings.map((f: any, i: number) => (
              <div key={i}>
                <strong>{f.type}</strong>
                <span>{f.severity}</span>
                <div>{f.function} • {f.category}</div>
                {f.description && <div>{f.description}</div>}
              </div>
            ))}
          </section>
        )}

        {data.portScan && (
          <section>
            <h2>Port Scan</h2>
            {Object.entries(data.portScan).map(([port, open]: any) => (
              <div key={port}>Port {port}: {open ? "Open" : "Closed"}</div>
            ))}
          </section>
        )}

        {data.redirect && (
          <section>
            <h2>Redirect Chain</h2>
            <div>Original: {data.redirect.original}</div>
            <div>Final: {data.redirect.final}</div>
          </section>
        )}

      </div>
    </div>
  );
}