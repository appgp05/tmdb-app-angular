import { Movie, MovieDetails } from "./movie.models"

export interface SearchHistoryItem {
    query: string
    timestamp: number
}

export interface MovieHistoryItem {
    id: number
    title: string
    poster_path: string | null
    release_date: string
    timestamp: number
}