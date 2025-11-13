const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

export interface OpenLibraryAuthor {
  key: string;
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { type: string; value: string };
  alternate_names?: string[];
  photos?: number[];
}

export interface SearchResult {
  docs: Array<{
    key: string;
    name: string;
    birth_date?: string;
    top_work?: string;
    work_count?: number;
  }>;
}

export async function searchAuthors(query: string): Promise<SearchResult> {
  if (!query.trim()) {
    return { docs: [] };
  }

  const url = `${OPEN_LIBRARY_BASE}/search/authors.json?q=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar autores: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    console.error('Erro detalhado na busca:', error);
    throw new Error(`Falha na conexão: ${error.message}`);
  }
}

export async function getAuthorDetails(authorKey: string): Promise<OpenLibraryAuthor> {
  const key = authorKey.replace('/authors/', '');
  const url = `${OPEN_LIBRARY_BASE}/authors/${key}.json`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter detalhes do autor: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    console.error('Erro ao buscar detalhes:', error);
    throw new Error(`Falha na conexão: ${error.message}`);
  }
}

export async function getAuthorWorks(authorKey: string, limit: number = 5) {
  const key = authorKey.replace('/authors/', '');
  const url = `${OPEN_LIBRARY_BASE}/authors/${key}/works.json?limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar obras: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    console.error('Erro ao buscar obras:', error);
    throw new Error(`Falha na conexão: ${error.message}`);
  }
}

export function extractBio(bio?: string | { type: string; value: string }): string | undefined {
  if (!bio) return undefined;
  if (typeof bio === 'string') return bio;
  return bio.value;
}

export function extractBirthYear(birthDate?: string): number | undefined {
  if (!birthDate) return undefined;
  const match = birthDate.match(/\d{4}/);
  return match ? parseInt(match[0]) : undefined;
}

