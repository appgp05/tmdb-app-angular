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
    credits: Credits
}

export interface Credits {
    cast: CastMember[]
    crew: CrewMember[]
}

export interface CastMember {
    id: number
    name: string
    character: string
    credit_id: string
    order: number
    profile_path: string | null
}

export interface CrewMember {
    id: number
    name: string
    job: string
    credit_id: string
    department: string
    profile_path: string | null
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