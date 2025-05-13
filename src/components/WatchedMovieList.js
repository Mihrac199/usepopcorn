import { useState, useEffect } from "react";
import { average, KEY } from "./_config";
import { Loader } from "./_element";
import StarRating from "./StarRating";


export function WatchedSummary({ watched }) {


     const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
     const avgUserRating = average(watched.map((movie) => movie.userRating));
     const avgRuntime = average(watched.map((movie) => movie.runtime));


     return (

          <div className="summary">

               <h2>Movies you watched</h2>

               <div>

                    <p>
                         <span>🎬</span>
                         <span>{watched.length || ""}</span>
                    </p>

                    <p>
                         <span>⭐️</span>
                         <span>{avgImdbRating ? avgImdbRating.toFixed(1) : ""}</span>
                    </p>

                    <p>
                         <span>🌟</span>
                         <span>{avgUserRating ? avgUserRating.toFixed(1) : ""}</span>
                    </p>

                    <p>
                         <span>⏳</span>
                         <span>{avgRuntime || ""}</span>
                    </p>

               </div>

          </div>

     );

};


export function WatchedMovieList({ watched, onDeleteWatched }) {

     return (

          <ul className="list">

               {watched?.map((movie) => (

                    <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />

               ))}

          </ul>

     );

};


function WatchedMovie({ movie, onDeleteWatched }) {

     return (

          <li>

               <img src={movie.poster} alt={`${movie.title} poster`} />

               <h3>{movie.title}</h3>

               <div>

                    <p>
                         <span>⭐️</span>
                         <span>{movie.imdbRating}</span>
                    </p>

                    <p>
                         <span>🌟</span>
                         <span>{movie.userRating}</span>
                    </p>

                    <p>
                         <span>⏳</span>
                         <span>{movie.runtime} min</span>
                    </p>

                    <button className="btn-delete" onClick={() => onDeleteWatched(movie.selectedId)}>X</button>

               </div>

          </li>

     );

};


export function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {


     const [movie, setMovie] = useState({});
     const [isLoading, setİsLoading] = useState(false);
     const [userRating, setUserRating] = useState("");

     const isWatched = watched.map((movie) => movie.selectedId).includes(selectedId);
     const $watchedUserRating = watched.find(movie => movie.selectedId === selectedId);
     const watchedUserRating = $watchedUserRating?.userRating;

     const {

          Title: title,
          Year: year,
          Poster: poster,
          Runtime: runtime,
          imdbRating,
          Plot: plot,
          Released: relased,
          Actors: actors,
          Director: director,
          Genre: genre,

     } = movie;


     useEffect(function () {

          async function getMovieDetails() {
               setİsLoading(true);

               const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
               const data = await res.json();
               setMovie(data);

               setİsLoading(false);
          };

          getMovieDetails();

     }, [selectedId]);


     useEffect(function () {

          if (!title) return;
          document.title = `Movie | ${title}`;

          return function () {
               document.title = "UsePopcorn";
          };

     }, [title]);


     useEffect(function () {

          function callBack(key) {
               if (key.key === "Escape") {
                    onCloseMovie();
               };
          };

          document.addEventListener("keydown", callBack);

          return function () {

               document.removeEventListener("keydown", callBack);
          };

     }, [onCloseMovie]);


     function handleAdd() {

          const newWatchedMovie = {
               selectedId,
               title,
               year,
               poster,
               imdbRating: Number(imdbRating),
               userRating,
               runtime: Number(runtime.split(" ").at(0)),
          };

          onAddWatched(newWatchedMovie);
          onCloseMovie();

     };


     return (

          <div className="details">

               {isLoading ? <Loader />
                    :
                    <>
                         <header>

                              <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
                              <img src={poster} alt={`Poster of ${movie} movie`} />

                              <div className="details-overview">

                                   <h2>{title}</h2>

                                   <p>{relased} &bull; {runtime}</p>
                                   <p>{genre}</p>
                                   <p><span>⭐️</span>{imdbRating} İMDb Rating</p>

                              </div>

                         </header>

                         <section>

                              <div className="rating">


                                   {isWatched
                                        ?
                                        <p>You Rated With Movie {watchedUserRating} <span>⭐️</span></p>
                                        :
                                        <>
                                             < StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                                             {userRating > 0 && <button className="btn-add" onClick={handleAdd}> Add To List</button>}
                                        </>
                                   }

                              </div>

                              <p><em>{plot}</em></p>
                              <p>Starring {actors}</p>
                              <p>Directed by {director}</p>

                         </section>
                    </>}

          </div>

     );

};