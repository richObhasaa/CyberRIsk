import axios from "axios";
import { ENV } from "../../src/config/env";

export const generateAISummary = async (findings: any, score: number) => {
    try {
        const prompt = `
        Below is the website security audit result:
        Score: ${score}
        Findings: ${JSON.stringify(findings)}

        Explain in simple terms for non-technical users:
        - What does this score mean
        - Main security risks
        - Recommended actions
        Use English language.
        `;

        const response = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
            {
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${ENV.DEEPSEEK_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;

    } catch {
        return "AI summary not available.";
    }
};