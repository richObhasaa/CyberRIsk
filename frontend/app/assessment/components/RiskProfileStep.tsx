import { Container, Button, Slider } from "./UI";

export default function RiskProfileStep({
  selectedOrg,
  riskProfile,
  setRiskProfile,
  nextStep,
  prevStep,
}: any) {
  return (
    <Container>
      <h2>Risk Profile — {selectedOrg?.name}</h2>

      <Slider
        label="Operational Likelihood"
        value={riskProfile.operational_likelihood}
        onChange={(v: number) =>
          setRiskProfile({ ...riskProfile, operational_likelihood: v })
        }
      />

      <Slider
        label="Operational Impact"
        value={riskProfile.operational_impact}
        onChange={(v: number) =>
          setRiskProfile({ ...riskProfile, operational_impact: v })
        }
      />

      <Button onClick={nextStep}>
        Continue to NIST Questions
      </Button>
    </Container>
  );
}