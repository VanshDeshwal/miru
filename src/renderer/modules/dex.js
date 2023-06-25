// Function to fetch manga chapters from MangaDex API
export async function getMangaChapters() {
    const mangaId = '64897926-3836-4307-a89d-86fb4d4ae4af'; // Replace with the actual manga ID
  
    try {
      const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed`);
      console.log(response)
      const data = await response.json();
      console.log(data)
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch manga chapters');
      }
  
      // Extract the relevant information from the API response
      const mangaChapters = data.results.map((result) => ({
        id: result.data.id,
        title: result.data.attributes.title,
        chapter: result.data.attributes.chapter,
        volume: result.data.attributes.volume,
      }));
  
      return mangaChapters;
    } catch (error) {
      throw new Error(`Failed to fetch manga chapters: ${error.message}`);
    }
  }
  