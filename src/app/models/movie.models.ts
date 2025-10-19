export interface Movie {
    id: number
    title: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    release_date: string
    vote_average: number
    vote_count: number
    genre_ids: number[]
}

export interface MovieDetails {
    id: number
    title: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    release_date: string
    vote_average: number
    vote_count: number
    genres: Genre[]
    runtime: number
    budget: number
    revenue: number
    status: string
    tagline: string
}

export interface Genre {
    id: number
    name: string
}

export interface SearchResponse {
    page: number
    results: Movie[]
    total_pages: number
    total_results: number
}