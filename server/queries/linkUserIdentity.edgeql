with
  identity := global ext::auth::ClientTokenIdentity,
  email := (
    select ext::auth::EmailPasswordFactor {
      email
    } filter .identity = identity),
  user := (
    select User
    filter .email = email.email
    limit 1
  ),
  updatedUser := (
    update User
    filter .id = user.id
    set {
      identity := identity
    }
  )
select User {
  id,
  name,
  email,
  role,
} filter .id = user.id
