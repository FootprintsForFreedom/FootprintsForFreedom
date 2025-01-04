export default defineEventHandler(async (req) => {
  const id = getRouterParam(req, "id")
  if (!id) {
    throw createError({ status: 400, message: "Missing id" })
  }

  const { getUser } = useEdgeDbQueries(req)
  const user = await getUser({ id: id })
  return user
})
