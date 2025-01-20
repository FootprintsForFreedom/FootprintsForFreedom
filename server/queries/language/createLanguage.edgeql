with
  number_of_languages := count(Language)
insert Language {
  code := <str>$code,
  name := <str>$name,
  native_name := <str>$native_name,
  order := number_of_languages + 1,
}