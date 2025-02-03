export interface ConfigurablePageMetadata {
  page: number
  per: number
}

export interface PageMetadata extends ConfigurablePageMetadata {
  total: number
}

export interface Page<T> {
  metadata: PageMetadata
  items: T[]
}
