with
  adminCount := ((
    select count(User)
    filter User.role = <Role>'Admin'
  ) ?? 0),
  newUserRole := (
    select <Role>'Admin' if adminCount = 0 else <Role>'User'
  )
insert User {
  name := <str>$name,
  email := <str>$email,
  role := newUserRole
};