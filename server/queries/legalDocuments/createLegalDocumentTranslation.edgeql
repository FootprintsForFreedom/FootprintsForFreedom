with
  legal_document := (
    select LegalDocument
    filter LegalDocument.id = <uuid>$documentId
  ),
  language := (
    select Language
    filter Language.code = <str>$languageCode
  )
insert LegalDocumentTranslation {
  document := legal_document,
  language := language,
  title := <str>$title,
  slug := <str>$slug,
  content := <str>$content,
}