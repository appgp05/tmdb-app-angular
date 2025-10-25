export type SortOption = 'added-asc' | 'added-desc' | 'title-asc' | 'title-desc' | 'release-asc' | 'release-desc'

export interface SortConfig {
    option: SortOption
    label: string
}