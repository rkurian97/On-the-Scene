let apiKey='?api_key=6409614a1cbe16090479d217424f788f';
let baseURL= 'https://api.themoviedb.org/3/'
let baseImgUrl= "https://image.tmdb.org/t/p/w92";
let configData= null;
let query= "jaws";
// w45, w92, w152, w185, w342, w500, w780  poster sizes

let findMovies= function (){
    fetch(baseURL+'search/movie'+apiKey+'&query='+query)
    .then(response => response.json())
    .then( function(data){
        console.log(baseImgUrl+data.results[0].poster_path)
        const container= document.getElementById("movie-search");
        const poster=document.createElement("img");
        poster.setAttribute("src", baseImgUrl+data.results[0].poster_path);
        poster.append
        container.append(poster)
    });

}

findMovies();
