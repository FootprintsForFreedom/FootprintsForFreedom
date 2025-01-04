select User {
  id,
  name,
  role
} filter .id = <uuid>$id;