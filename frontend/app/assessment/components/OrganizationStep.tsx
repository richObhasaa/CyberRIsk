"use client";

import { useState } from "react";
import { Container, Button, Input } from "./UI";

export default function OrganizationStep({
  organizations = [],
  onSelect,
  createOrganization,
  period,
  setPeriod,
  orgMeta,
  setOrgMeta,
}: any) {
  const [newOrgName, setNewOrgName] = useState("");
  const [creating, setCreating] = useState(false);

  function validateMeta() {
    if (!period.start || !period.end) {
      alert("Please fill in both Assessment Period dates.");
      return false;
    }
    if (!orgMeta.business_sector.trim()) {
      alert("Please fill in Business Sector.");
      return false;
    }
    if (!orgMeta.employee_range) {
      alert("Please select Employee Range.");
      return false;
    }
    return true;
  }

  async function handleCreate() {
    if (!newOrgName.trim()) {
      alert("Please enter an organization name.");
      return;
    }
    if (!validateMeta()) return;

    setCreating(true);
    try {
      const res = await createOrganization({
        name: newOrgName,
        business_sector: orgMeta.business_sector,
        employee_range: orgMeta.employee_range,
      });

      if (!res?.organization?.id) {
        alert("Failed creating organization.");
        return;
      }

      // Auto-select the newly created org to proceed
      onSelect(res.organization);
    } catch (err: any) {
      alert(err.message || "Error creating organization.");
    } finally {
      setCreating(false);
    }
  }

  function handleSelectExisting(org: any) {
    if (!validateMeta()) return;
    onSelect(org);
  }

  return (
    <Container>
      {/* ── Assessment Metadata (required first) ── */}
      <h2>Assessment Details</h2>

      <h3>Assessment Period</h3>
      <label style={labelStyle}>Start Date</label>
      <input
        type="date"
        value={period.start}
        onChange={(e) =>
          setPeriod({ ...period, start: e.target.value })
        }
        style={inputStyle}
      />

      <label style={labelStyle}>End Date</label>
      <input
        type="date"
        value={period.end}
        onChange={(e) =>
          setPeriod({ ...period, end: e.target.value })
        }
        style={inputStyle}
      />

      <h3>Business Sector</h3>
      <Input
        placeholder="e.g Financial Services"
        value={orgMeta.business_sector}
        onChange={(e: any) =>
          setOrgMeta({
            ...orgMeta,
            business_sector: e.target.value,
          })
        }
      />

      <h3>Employee Range</h3>
      <select
        value={orgMeta.employee_range}
        onChange={(e) =>
          setOrgMeta({
            ...orgMeta,
            employee_range: e.target.value,
          })
        }
        style={inputStyle}
      >
        <option value="">Select Range</option>
        <option value="1-50">1-50</option>
        <option value="51-200">51-200</option>
        <option value="201-1000">201-1000</option>
        <option value="1000+">1000+</option>
      </select>

      <hr style={{ margin: "30px 0" }} />

      {/* ── Select Existing Organization ── */}
      {organizations.length > 0 && (
        <div>
          <h2>Select Existing Organization</h2>
          {organizations.map((org: any) => (
            <div key={org.id} style={{ marginBottom: 12 }}>
              <Button onClick={() => handleSelectExisting(org)}>
                {org.name}
              </Button>
            </div>
          ))}
          <hr style={{ margin: "30px 0" }} />
        </div>
      )}

      {/* ── Create New Organization ── */}
      <h2>Create New Organization</h2>

      <Input
        value={newOrgName}
        onChange={(e: any) => setNewOrgName(e.target.value)}
        placeholder="Organization name"
      />

      <Button onClick={handleCreate} disabled={creating}>
        {creating ? "Creating..." : "Create & Continue"}
      </Button>
    </Container>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 4,
  color: "#aaa",
  fontSize: 14,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  background: "#111",
  color: "white",
  border: "1px solid #444",
  borderRadius: 6,
};