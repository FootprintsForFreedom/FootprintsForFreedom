export default defineEventHandler(async (req) => {
  const { linkUserIdentity } = useEdgeDbQueries(req)

  const res = await linkUserIdentity()
  return res
})
