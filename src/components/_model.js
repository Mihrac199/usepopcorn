import { KEY } from "./_config";


// Get Search Movie
export function getSearchFetch(setİsLoading, setError, query, setMovies, handleCloseMovie) {

     const controller = new AbortController();

     async function fetchMovies() {

          try {

               setİsLoading(true);

               setError("");

               const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });

               // Apı getting error message.
               if (!res.ok) throw new Error("Something went wrong with fetching movies...");

               const data = await res.json();

               // Not movie result.
               if (data.Response === "False") throw new Error("Movie not found...");

               setMovies(data.Search);

               setError("");

          } catch (error) {

               if (error.name !== "AbortError") {

                    setError(error.message);

               };

          } finally {

               setİsLoading(false);

          };

          if (query.length < 3) {

               setError("");

               setMovies([]);

          };

     };

     fetchMovies();

     handleCloseMovie();

     return function () {

          controller.abort();

     };

};


// Get Movie Deetails
export function getMovieDetailsFetch(setİsLoading, selectedId, setMovie) {

     async function getMovieDetails() {

          setİsLoading(true);

          const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
          const data = await res.json();
          setMovie(data);

          setİsLoading(false);
     };

     getMovieDetails();

};