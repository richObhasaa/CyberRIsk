import { supabase } from "../../src/db/supabase"

export const saveChat = async (
  userId: string,
  message: string,
  reply: string
): Promise<void> => {

  const { error } = await supabase
    .from("chats")
    .insert([
      {
        user_id: userId,
        message,
        reply
      }
    ])

  if (error) {
    console.error("Supabase insert error:", error)
  }
}