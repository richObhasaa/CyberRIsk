import { Container, Button } from "./UI";

export default function RoleStep({ setRole, setStep }: any) {
  return (
    <Container>
  <div className="flex flex-col items-center justify-center min-h-[350px] text-center">
    
    <h2 className="text-3xl font-bold mb-10">
      Select User Role
    </h2>

    <div className="flex gap-6">
      <Button
        onClick={() => { setRole("IT"); setStep(2); }}
      >
        IT / Cybersecurity
      </Button>

      <Button
        onClick={() => { setRole("NON_IT"); setStep(2); }}
      >
        Non-IT User
      </Button>
    </div>

  </div>
</Container>
  );
}