const baseURL= 'https://api.themoviedb.org/3/';
const baseImgUrl= "https://image.tmdb.org/t/p/";
const smallPosterURL= 'w92';
const bigPosterURL= 'w342';

// w45, w92, w152, w185, w342, w500, w780  poster sizes
let query="jaws";
//grabbing html elements
const queryContainer= document.getElementById("movie-search");
const movieModal= document.getElementById("movieModal");
const exitModal= document.getElementById("exitModal");
const searchText= document.getElementById("searchText")
const searchButton= document.getElementById ("searchButton")
// html elements - grab the html elemts by id
const modalPoster= document.getElementById("modalPoster");
const modalOverview= document.getElementById("modalOverview");
const modalRating= document.getElementById("modalRating");
const modalTitle= document.getElementById("modalTitle");

//eventlistener
searchButton.addEventListener("click", function(){
    query= searchText.value; 
    queryContainer.innerHTML= "" 
    findMovies();
});

//onclick function for each poster
let activateModal= function(title, overview, rating, bigPosterPath){
    modalTitle.innerHTML= title;
    modalOverview.innerHTML= overview;
    modalRating.innerHTML= rating;
    modalPoster.setAttribute("src", bigPosterPath);
    console.log(title);
    console.log(overview);
    console.log(rating);
    console.log(bigPosterPath);
    movieModal.setAttribute("style", "display:block");
}

//search query function
let findMovies= function (){
    fetch(baseURL+'search/movie'+apiKey+'&query='+query)
    .then(response => response.json())
    .then( function(data){
        //loops through each object in the results response to show all posters
        console.log(data);
        for (i=0; i<data.results.length; i++){
            // if the movie does not have a poster we do not add to the results
            if(data.results[i].poster_path){
                const poster=document.createElement("img");
                poster.setAttribute("src", baseImgUrl+smallPosterURL+data.results[i].poster_path);
                let title= JSON.stringify(data.results[i].original_title);
                let overview= JSON.stringify(data.results[i].overview);
                let rating= JSON.stringify(data.results[i].vote_average);
                let bigPosterPath= JSON.stringify(baseImgUrl+bigPosterURL+data.results[i].poster_path)
                let releaseDate= JSON.stringify(data.results[i].release_date);
                poster.setAttribute('onclick', 'activateModal('+title+ ','+overview+','+rating+','+bigPosterPath+','+ releaseDate+ ');');
                queryContainer.append(poster);
            }
        }
    });
}

//onclick function so that when you click in the background of the modal it exits out. 
window.onclick= function(event){
    if (event.target.className== 'modal-background'){
        movieModal.setAttribute("style", "display:none");
    }
}

// exitModal.onclick= function(){
//     movieModal.setAttribute("style", "display:none");
// }

