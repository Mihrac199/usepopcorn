import { useEffect, useState } from "react";
import { KEY } from "./_config.js";
import { Main, Box, Loader, ErrorMessage } from "./_element.js";
import { NavBar, Logo, Search, NumResult } from "./NavBar.js";
import { MovieList } from "./SearchMovieList.js";
import { MovieDetails, WatchedSummary, WatchedMovieList } from "./WatchedMovieList.js";


export default function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setİsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);


  useEffect(function () {

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

  }, [query]);


  function handleSelectMovie(id) {
    setSelectedId(() => id === selectedId ? null : id);
  };


  function handleCloseMovie() {
    setSelectedId(null);
  };


  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
  };


  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.selectedId !== id))
  };


  return (

    <>

      <NavBar>

        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />

      </NavBar >

      <Main>

        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>

          {
            selectedId
              ?
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched} />
              :
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
              </>
          }
        </Box>

      </Main>

    </>

  );

};