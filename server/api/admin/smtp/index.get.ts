export default defineEventHandler(async (req) => {
  const client = useEdgeDb(req)

  const config = await client.query(`
    select ext::auth::SMTPConfig { * };
  `)

  console.log(config)
  return config
})
