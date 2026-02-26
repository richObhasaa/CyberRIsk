"use client";

import { useEffect, useState } from "react";
import {
  getDrafts,
  approveFinalize,
} from "../../lib/api";

export default function AdminReview() {
  const [drafts, setDrafts] =
    useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getDrafts();
        setDrafts(res.drafts);
      } catch (err: any) {
        alert(err.message);
      }
    }

    load();
  }, []);

  async function approve(id: string) {
    try {
      await approveFinalize({
        assessment_id: id,
        approval_note:
          "Approved for demo",
      });

      alert("Finalized");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Draft Review</h1>

      {drafts.map((d) => (
        <div key={d.id}>
          <p>{d.name}</p>
          <button
            onClick={() => approve(d.id)}
          >
            Approve & Finalize
          </button>
        </div>
      ))}
    </div>
  );
}