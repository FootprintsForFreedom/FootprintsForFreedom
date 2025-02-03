with
  total := count(User),
  users := (
    select User {
      id,
      name,
      role,
    }
    order by .name
    offset <int64>$offset
    limit <int64>$limit
  )
select {
  total := total,
  users := users { id, name, role },
};
