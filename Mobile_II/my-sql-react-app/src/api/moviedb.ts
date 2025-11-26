const MOVIEDB_BASE = 'https://api.themoviedb.org/3';

const TMDB_API_KEY = '';



export interface MovieDBMovie {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  genre_ids?: number[];
  vote_average?: number;
}

export interface MovieDBSearchResult {
  results: MovieDBMovie[];
  total_results: number;
}

export interface MovieDBDetails {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  genres?: Array<{ id: number; name: string }>;
  vote_average?: number;
  runtime?: number;
  director?: string;
}

// Mapeamento de IDs de gêneros do TMDB para nomes em português
const GENRE_MAP: Record<number, string> = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção Científica',
  10770: 'Cinema TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Faroeste'
};

export async function searchMovies(query: string, apiKey?: string): Promise<MovieDBSearchResult> {
  if (!query.trim()) {
    return { results: [], total_results: 0 };
  }

  const key = apiKey || TMDB_API_KEY;

  if (!key) {
    throw new Error('API Key do TMDB não configurada');
  }

  const url = `${MOVIEDB_BASE}/search/movie?api_key=${key}&query=${encodeURIComponent(query)}&language=pt-BR`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar filmes: ${response.status}`);
  }

  return response.json();
}

export async function getMovieDetails(movieId: number, apiKey?: string): Promise<MovieDBDetails> {
  const key = apiKey || TMDB_API_KEY;

  if (!key) {
    throw new Error('API Key do TMDB não configurada');
  }

  const url = `${MOVIEDB_BASE}/movie/${movieId}?api_key=${key}&language=pt-BR&append_to_response=credits`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao obter detalhes do filme: ${response.status}`);
  }

  const data = await response.json();
  
  // Extrair diretor do elenco técnico
  const director = data.credits?.crew?.find((person: any) => person.job === 'Director')?.name;
  
  return {
    ...data,
    director
  };
}

export function extractYear(releaseDate?: string): number | undefined {
  if (!releaseDate) return undefined;
  const match = releaseDate.match(/\d{4}/);
  return match ? parseInt(match[0]) : undefined;
}

export function getGenreName(genreIds?: number[]): string {
  if (!genreIds || genreIds.length === 0) return 'Geral';
  return GENRE_MAP[genreIds[0]] || 'Geral';
}

export function getGenreNames(genres?: Array<{ id: number; name: string }>): string {
  if (!genres || genres.length === 0) return 'Geral';
  return genres[0].name || 'Geral';
}

