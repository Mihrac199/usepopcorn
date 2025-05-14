import { useState, useEffect, useRef } from "react";
import { Loader } from "./_element";
import StarRating from "./StarRating";
import { getMovieDetailsFetch } from "./_model";


export function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {

     const [movie, setMovie] = useState({});
     const [isLoading, setİsLoading] = useState(false);
     const [userRating, setUserRating] = useState("");
     const countRef = useRef(0);

     const isWatched = watched.map((movie) => movie.selectedId).includes(selectedId);
     const $watchedUserRating = watched.find(movie => movie.selectedId === selectedId);
     const watchedUserRating = $watchedUserRating?.userRating;

     const {

          Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: relased, Actors: actors, Director: director, Genre: genre,

     } = movie;


     useEffect(function () {

          if (userRating) countRef.current++;

     }, [userRating]);


     useEffect(function () {

          getMovieDetailsFetch(setİsLoading, selectedId, setMovie);

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
               countClickRating: countRef.current,
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
                                             <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                                             {userRating > 0 && <button className="btn-add" onClick={handleAdd}> Add To List</button>}
                                        </>}

                              </div>

                              <p><em>{plot}</em></p>
                              <p>Starring {actors}</p>
                              <p>Directed by {director}</p>

                         </section>
                    </>}

          </div>

     );

};