<script>
  import { onMount } from 'svelte'
  import ePub from 'epubjs'
  import { getMangaChapters } from '@/modules/dex.js' // Import your API module for MangaDex integration

  let book;
  let rendition;
  let currentBook;
  let mangaChapters = [];

  const books = [
    { title: 'Book 1', path: 'https://filesamples.com/samples/ebook/epub/sample1.epub' },
  ];

  async function initializeEpub() {
    book = ePub();
    rendition = book.renderTo("viewer", {
        manager: "continuous",
        flow: "scrolled",
        width: 700,
        height: 750
      });
    rendition.on('keyup', handleKeyup);
    rendition.on('keydown', handleKeydown);
    rendition.on('selected', handleTextSelection);

    // Fetch manga chapters from MangaDex API
    try {
      mangaChapters = await getMangaChapters(); // Implement the getMangaChapters function in your API module
    } catch (error) {
      console.error('Failed to fetch manga chapters:', error);
    }
  }

  function handleKeyup(e) {
    if (e.key === 'ArrowLeft') {
      rendition.prev();
    } else if (e.key === 'ArrowRight') {
      rendition.next();
    }
  }

  function handleKeydown(e) {
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  }

  function handleTextSelection(selectedText) {
    console.log('Selected text:', selectedText);
  }

  function openBook(path) {
    if (currentBook) {
      currentBook.destroy();
    }

    currentBook = ePub(path);
    currentBook.open().then(() => {
      rendition.display(currentBook);
    });
  }

  async function openChapter(chapter) {
    try {
      const chapterData = await openChapter(chapter.id); // Implement the openChapter function in your API module
      console.log('Chapter Data:', chapterData);
      // Perform actions with the chapter data, such as rendering the pages in the viewer
    } catch (error) {
      console.error('Failed to open chapter:', error);
    }
  }

  onMount(initializeEpub);  
</script>

<div class='d-flex h-full flex-column overflow-y-scroll '>
  <div class='h-full py-10'>
    <div class="library">
      {#each books as book}
        <div class="book" on:click={() => openBook(book.path)} on:keydown={() => openBook(book.path)}>
          {book.title}
        </div>
      {/each}
    
      {#each mangaChapters as chapter}
        <div class="book" on:click={() => openChapter(chapter)} on:keydown={() => openChapter(chapter)}>
          {chapter.title}
        </div>
      {/each}
    </div>
    
    <div id="viewer">
    
    <!-- <button on:click={rendition.next()}>Next</button> -->

    </div>
  </div>
</div>

    

<style type="text/css">

  .epub-container {
    /* min-width: 320px; */
    /* margin: 0 auto; */
    /* position: relative; */
  }

  .epub-container .epub-view > iframe {
      background: white;
      box-shadow: 0 0 4px #ccc;
      /*margin: 10px;
      padding: 20px;*/
  }

  #viewer {
    width: 600px;
    height: 100vh;
    /* overflow: auto; */
    margin: 0 auto;
  }

</style>



