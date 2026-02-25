"use client";

import { useState } from "react";
import { Container, Button, Input } from "./UI";

export default function OrganizationStep({
  organizations,
  onSelect,
  createOrganization,
}: any) {
  const [newOrgName, setNewOrgName] = useState("");

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

      <Button
        onClick={async () => {
          if (!newOrgName.trim()) return;

          const res = await createOrganization({ name: newOrgName });

          if (!res?.organization?.id) {
            alert("Failed creating organization.");
            return;
          }

          onSelect(res.organization);
        }}
      >
        Create
      </Button>
    </Container>
  );
}