import { useState } from "react";
import { Container, Button, Input } from "./UI";

export default function QuestionsStep({
  questions,
  loading,
  selectedOrg,
  riskProfile,
  submitSubcategory,
}: any) {
  const [answers, setAnswers] = useState<any>({});

  return (
    <Container>
      <h2>NIST CSF Questions</h2>

      {loading && <p>Loading...</p>}

      {questions.map((q: any) => (
        <div key={q.id} style={{ marginBottom: 20 }}>
          <p>{q.question_text}</p>
          <Input
            type="number"
            min={1}
            max={5}
            onChange={(e: any) =>
              setAnswers({
                ...answers,
                [q.id]: Number(e.target.value),
              })
            }
          />
        </div>
      ))}

      <Button
        onClick={async () => {
          for (const q of questions) {
            if (!answers[q.id]) {
              alert("All questions must be answered");
              return;
            }
          }

          await submitSubcategory({
            organization_id: selectedOrg.id,
            answers,
            riskProfile,
          });

          alert("Assessment submitted");
        }}
      >
        Submit Assessment
      </Button>
    </Container>
  );
}