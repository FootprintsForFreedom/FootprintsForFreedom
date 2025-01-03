export default defineEventHandler(async (req) => {
  const { getCurrentUser } = useEdgeDbQueries(req)

  const user = await getCurrentUser()
  console.log(user)
  return user
})
