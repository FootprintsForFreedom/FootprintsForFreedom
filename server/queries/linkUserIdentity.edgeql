with
  global_identity := global ext::auth::ClientTokenIdentity,
  email := (
    select ext::auth::EmailPasswordFactor {
      email
    } filter .identity = global_identity),
update User
filter .email = email.email
set {
  identity := global_identity
};
