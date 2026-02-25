import { useState } from "react";
import { Container, Button, Input } from "./UI";

export default function OrganizationStep({
  organizations,
  setSelectedOrg,
  setStep,
  role,
  createOrganization,
}: any) {
  const [newOrgName, setNewOrgName] = useState("");

  return (
    <Container>
      <h2>Select Organization</h2>

      {organizations.map((org: any) => (
        <div key={org.organizations.id}>
          <Button
            onClick={() => {
              setSelectedOrg(org.organizations);
              setStep(role === "IT" ? 3 : 4);
            }}
          >
            {org.organizations.name}
          </Button>
        </div>
      ))}

      <hr style={{ margin: "30px 0" }} />

      <h3>Create New Organization</h3>

      <Input
        value={newOrgName}
        onChange={(e: any) => setNewOrgName(e.target.value)}
        placeholder="Organization name"
      />

      <Button
        onClick={async () => {
          if (!newOrgName) return alert("Name required");

          const res = await createOrganization({ name: newOrgName });

          setSelectedOrg(res.organization);
          setStep(role === "IT" ? 3 : 4);
        }}
      >
        Create
      </Button>
    </Container>
  );
}