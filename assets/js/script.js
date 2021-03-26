const apiKey='?api_key=6409614a1cbe16090479d217424f788f';
const baseURL= 'https://api.themoviedb.org/3/'
const baseImgUrl= "https://image.tmdb.org/t/p/w92";

let query= "jaws";
// w45, w92, w152, w185, w342, w500, w780  poster sizes

const queryContainer= document.getElementById("movie-search");
const movieModal= document.getElementById("movieModal");

let activateModal= function(){
    console.log("hello")
    movieModal.setAttribute("style", "display:block");
}

let findMovies= function (){
    fetch(baseURL+'search/movie'+apiKey+'&query='+query)
    .then(response => response.json())
    .then( function(data){
        console.log(data);
        for (i=0; i<data.results.length; i++){
            if(data.results[i].poster_path){
                console.log(baseImgUrl+data.results[i].poster_path);
                const poster=document.createElement("img");
                poster.setAttribute("src", baseImgUrl+data.results[i].poster_path);
                poster.setAttribute("onclick", "activateModal();");
                queryContainer.append(poster);
            }
        }
    });
}

window.onclick= function(event){
    if (event.target.className== 'modal-background'){
        movieModal.setAttribute("style", "display:none");
    }
}

findMovies();
