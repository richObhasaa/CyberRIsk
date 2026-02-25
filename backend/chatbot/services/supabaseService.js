const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function saveChat(userId, message, reply) {
  const { error } = await supabase
    .from("chats")
    .insert([
      {
        user_id: userId,
        message,
        reply
      }
    ])

  if (error) console.error(error)
}

module.exports = { saveChat }