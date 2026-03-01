"use client";

import { useState } from "react";
import { Container, Button, Input } from "./UI";
import { DateInput, TextInput, SelectInput } from "../../components/formComponents";

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
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Assessment Details</h2>

        <h3>Assessment Period</h3>

        {/* ✅ DateInput onChange receives string value directly */}
        <DateInput
          label="Start Date"
          value={period.start}
          onChange={(value) => setPeriod({ ...period, start: value })}
        />

        <DateInput
          label="End Date"
          value={period.end}
          onChange={(value) => setPeriod({ ...period, end: value })}
        />

        {/* ✅ TextInput onChange also receives string value directly */}
        <TextInput
          label="Business Sector"
          placeholder="e.g Financial Services"
          value={orgMeta.business_sector}
          onChange={(value) => setOrgMeta({ ...orgMeta, business_sector: value })}
        />

        <SelectInput
          label="Employee Range"
          value={orgMeta.employee_range}
          onChange={(value) => setOrgMeta({ ...orgMeta, employee_range: value })}
          options={[
            { label: "Select Employee Range", value: "" },
            { label: "1-50", value: "1-50" },
            { label: "51-200", value: "51-200" },
            { label: "201-1000", value: "201-1000" },
            { label: "1000+", value: "1000+" },
          ]}
        />

        <hr className="my-8 border-white/10" />


        <h2>Type in your organization</h2>

        <TextInput
          label="Organization Name"
          value={newOrgName}
          onChange={setNewOrgName}
          placeholder="Organization name"
        />

        <Button onClick={handleCreate} disabled={creating}>
          {creating ? "Creating..." : "Create & Continue"}
        </Button>
      </div>
    </Container>
  );
}