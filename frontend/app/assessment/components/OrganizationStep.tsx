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

  async function handleCreate() {
    if (!newOrgName.trim()) return;

    try {
      setCreating(true);

      const res = await createOrganization({
        name: newOrgName,
      });

      if (!res?.organization?.id) {
        alert("Failed creating organization.");
        return;
      }

      setNewOrgName("");
      onSelect(res.organization);
    } catch (err) {
      console.error(err);
      alert("Error creating organization.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Container>
      <h2>Select Organization</h2>

      {organizations.map((item: any, index: number) => {
        const org =
          item?.organizations ||
          item?.organization ||
          item;

        if (!org?.id) return null;

        return (
          <div key={org.id || index} style={{ marginBottom: 12 }}>
            <Button onClick={() => onSelect(org)}>
              {org.name}
            </Button>
          </div>
        );
      })}

      <hr style={{ margin: "30px 0" }} />

      <h3>Create New Organization</h3>

      <Input
        value={newOrgName}
        onChange={(e: any) => setNewOrgName(e.target.value)}
        placeholder="Organization name"
      />

      <Button onClick={handleCreate}>
        {creating ? "Creating..." : "Create"}
      </Button>

      <hr style={{ margin: "30px 0" }} />

      <h3>Assessment Period</h3>

      <Input
        type="date"
        value={period?.start || ""}
        onChange={(e: any) =>
          setPeriod?.({ ...period, start: e.target.value })
        }
      />

      <Input
        type="date"
        value={period?.end || ""}
        onChange={(e: any) =>
          setPeriod?.({ ...period, end: e.target.value })
        }
      />

      <h3>Business Sector</h3>

      <Input
        placeholder="e.g Financial Services"
        value={orgMeta?.business_sector || ""}
        onChange={(e: any) =>
          setOrgMeta?.({
            ...orgMeta,
            business_sector: e.target.value,
          })
        }
      />

      <h3>Employee Range</h3>

      <select
        style={{ padding: 10, marginBottom: 20 }}
        value={orgMeta?.employee_range || ""}
        onChange={(e) =>
          setOrgMeta?.({
            ...orgMeta,
            employee_range: e.target.value,
          })
        }
      >
        <option value="">Select Range</option>
        <option value="1-50">1-50</option>
        <option value="51-200">51-200</option>
        <option value="201-1000">201-1000</option>
        <option value="1000+">1000+</option>
      </select>
    </Container>
  );
}