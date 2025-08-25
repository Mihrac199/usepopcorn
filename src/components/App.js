import { useEffect, useState } from "react"
import { Main, Box, Loader, ErrorMessage } from "./_element.js"
import { NavBar, Logo, Search, NumResult } from "./NavBar.js"
import { MovieList } from "./SearchMovieList.js"
import { WatchedSummary, WatchedMovieList } from "./WatchedMovieList.js"
import { MovieDetails } from "./MovieDetails.js"
import { getSearchFetch } from "./_model.js"

export default function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setİsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useState(function () {

    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);

  });

  useEffect(function () {

    return getSearchFetch(setİsLoading, setError, query, setMovies, handleCloseMovie);

  }, [query]);


  useEffect(function () {

    return localStorage.setItem("watched", JSON.stringify(watched));

  }, [watched]);


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