import axios from "axios"

export const generateResponse = async (message: string): Promise<string> => {
  const response = await axios.post(
    "https://api.deepseek.com/chat/completions",
    {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity assistant."
        },
        {
          role: "user",
          content: message
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  )

  return response.data.choices[0].message.content
}