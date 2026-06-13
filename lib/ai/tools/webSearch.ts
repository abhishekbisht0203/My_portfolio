import { search } from 'duck-duck-scrape';

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

export async function performWebSearch(query: string, limit = 5): Promise<SearchResult[]> {
  try {
    const results = await search(query);
    
    return results.results.slice(0, limit).map(res => ({
      title: res.title,
      url: res.url,
      description: res.description
    }));
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

export function formatSearchResultsForPrompt(results: SearchResult[]): string {
  if (results.length === 0) return '';
  
  let formatted = '\n\n--- WEB SEARCH RESULTS ---\n';
  formatted += 'Use the following recent information to answer the user query if relevant. Cite the sources using markdown links.\n\n';
  
  results.forEach((res, index) => {
    formatted += `[${index + 1}] Title: ${res.title}\n`;
    formatted += `URL: ${res.url}\n`;
    formatted += `Snippet: ${res.description}\n\n`;
  });
  
  formatted += '--- END WEB SEARCH RESULTS ---\n';
  return formatted;
}
