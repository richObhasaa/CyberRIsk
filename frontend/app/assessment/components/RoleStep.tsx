import { Container, Button } from "./UI";

export default function RoleStep({ setRole, setStep }: any) {
  return (
    <Container>
      <h2>Select User Role</h2>
      <Button onClick={() => { setRole("IT"); setStep(2); }}>
        IT / Cybersecurity
      </Button>
      <Button onClick={() => { setRole("NON_IT"); setStep(2); }}>
        Non-IT User
      </Button>
    </Container>
  );
}