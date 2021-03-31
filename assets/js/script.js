const baseURL= 'https://api.themoviedb.org/3/';
const baseImgUrl= "https://image.tmdb.org/t/p/";
const smallPosterURL= 'w185';
const bigPosterURL= 'w342';
let key=0;
if(localStorage){
    key=localStorage.length;
}                                                  

// w45, w92, w152, w185, w342, w500, w780  poster sizes
let query="jaws";
//grabbing html elements
const queryContainer= document.getElementById("queryContainer");
const searchText= document.getElementById("searchText");
const searchButton= document.getElementById ("searchButton");

// movie modal elements
const movieModal= document.getElementById("movieModal");
const exitModal= document.getElementById("exitModal");
const modalPoster= document.getElementById("modalPoster");
const modalOverview= document.getElementById("modalOverview");
const modalRating= document.getElementById("modalRating");
const modalTitle= document.getElementById("modalTitle");
const modalReleaseDate= document.getElementById("modalReleaseDate");
const favoriteButton= document.getElementById("favorite");

//Streaming elements
const availabilityButton= document.getElementById("availabilityButton");
const netflix= document.getElementById("netflix");
const hbo= document.getElementById("hbo");
const prime=document.getElementById("prime");
const disney=document.getElementById("disney");
const hulu=document.getElementById("hulu");
const none= document.getElementById("none");

//eventlistener for search button 
searchButton.addEventListener("click", function(){
    query= searchText.value; 
    queryContainer.innerHTML= "" 
    findMovies();
});

//onclick function for each poster
let activateModal= function(title, overview, rating, bigPosterPath, releaseDate, smallPosterPath, id){
    modalTitle.innerHTML= title;
    modalOverview.innerHTML= overview;
    modalRating.innerHTML= modalRating.innerHTML+ rating;
    modalReleaseDate.innerHTML=modalReleaseDate.innerHTML+releaseDate;
    modalPoster.setAttribute("src", bigPosterPath);
    movieModal.setAttribute("style", "display:block");
    smallPosterPath=JSON.stringify(smallPosterPath);
    favoriteButton.setAttribute("data-id", JSON.stringify(id));
    favoriteButton.setAttribute("onclick","recordFavorite("+smallPosterPath+")")

    hbo.setAttribute("style", "display: none");
    netflix.setAttribute("style", "display: none");
    prime.setAttribute("style", "display: none");
    disney.setAttribute("style", "display: none");
    hulu.setAttribute("style", "display: none");
    none.setAttribute("style", "display: none");
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
                //making column div container for each poster
                const imgDiv= document.createElement("div");
                imgDiv.setAttribute("class", "column is-one-fifth");
                queryContainer.append(imgDiv)

                //making another div for the gradient effect
                const gradientDiv= document.createElement("div");
                gradientDiv.setAttribute("class", "gradientDiv");
                imgDiv.append(gradientDiv);
                
                //making poster and adding its data into the activateModal function
                const poster=document.createElement("img");
                let smallPosterPath=data.results[i].poster_path;
                poster.setAttribute("src", baseImgUrl+smallPosterURL+smallPosterPath);
                poster.setAttribute("class", "smallPoster");

                smallPosterPath=JSON.stringify(smallPosterPath);
                let title= JSON.stringify(data.results[i].original_title);
                let overview= JSON.stringify(data.results[i].overview);
                let rating= JSON.stringify(data.results[i].vote_average);
                let bigPosterPath= JSON.stringify(baseImgUrl+bigPosterURL+data.results[i].poster_path)
                let releaseDate= JSON.stringify(data.results[i].release_date);
                let id=JSON.stringify(data.results[i].id);

                poster.setAttribute('onclick', 'activateModal('+title+ ','+overview+','+rating+','+bigPosterPath+','+ releaseDate+ ','+smallPosterPath+','+id+');');
                gradientDiv.append(poster);
            }
        }
    });
}

//onclick function so that when you click in the background of the modal it exits out. Or if you click the x button on the modal
window.onclick= function(event){
    if (event.target.className== 'modal-background'){
        movieModal.setAttribute("style", "display:none");
    }
}
exitModal.onclick= function(){
    movieModal.setAttribute("style", "display:none");
}

//record favorite function. Sets poster path into local storage
let recordFavorite=function(smallPosterPath){
    
    for(let i=0; i<localStorage.length; i++){
        if (localStorage.getItem(localStorage.key(i))==smallPosterPath){
            return;
        }
    }
    localStorage.setItem(key, smallPosterPath);
    key++;


}

availabilityButton.addEventListener("click", function(){

    let id=favoriteButton.getAttribute("data-id");
    fetch(`https://streaming-availability.p.rapidapi.com/get/basic?country=us&tmdb_id=movie%2F${id}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "4e9ad7e5a5msh0a57503ac951c9dp1d772fjsn68cba4b29124",
            "x-rapidapi-host": "streaming-availability.p.rapidapi.com"
        }
    })
    .then(response => response.json())
    .then(function(data){
            console.log(data);
            if(data.streamingInfo.hasOwnProperty("hbo")){
                hbo.setAttribute("style", "display: block");
            }else if (data.streamingInfo.hasOwnProperty("netflix")){
                netflix.setAttribute("style", "display: block");
            }else if (data.streamingInfo.hasOwnProperty("prime")){
                prime.setAttribute("style", "display: block");
            }else if(data.streamingInfo.hasOwnProperty("disney")){
                disney.setAttribute("style", "display: block");
            }else if(data.streamingInfo.hasOwnProperty("hulu")){
                hulu.setAttribute("style", "display: block");
            }else{
                none.setAttribute("style", "display: block");
            }
    
    });

});

