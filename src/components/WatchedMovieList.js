import { average } from "./_config";


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