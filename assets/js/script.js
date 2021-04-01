// urls
const baseURL= 'https://api.themoviedb.org/3/';
const baseImgUrl= "https://image.tmdb.org/t/p/";
const smallPosterURL= 'w185';
const bigPosterURL= 'w342';

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
    // find movies is the function that does the api call
    findMovies();
});

//onclick function for each poster. this function populates the modal with the information based on the movie that was clicked. 
let activateModal= function(title, overview, rating, bigPosterPath, releaseDate, smallPosterPath, id){
    //setting inner html
    modalTitle.innerHTML= title;
    modalOverview.innerHTML= overview;
    modalRating.innerHTML= modalRating.innerHTML+ rating;
    modalReleaseDate.innerHTML=modalReleaseDate.innerHTML+releaseDate;
    modalPoster.setAttribute("src", bigPosterPath);
    movieModal.setAttribute("style", "display:block");

    //passing in the poster path as an attribute on the favorite button, so the recordFavroite function can record it into local storage if it was clicked. 
    smallPosterPath=JSON.stringify(smallPosterPath);
    favoriteButton.setAttribute("data-id", JSON.stringify(id));
    favoriteButton.setAttribute("onclick","recordFavorite("+smallPosterPath+")")

    //every time a new poster is clicked initializing the display of the streaming logos to none. When the availability button is clicked it will repopulate based on the new movie clicked
    hbo.setAttribute("style", "display: none");
    netflix.setAttribute("style", "display: none");
    prime.setAttribute("style", "display: none");
    disney.setAttribute("style", "display: none");
    hulu.setAttribute("style", "display: none");
    none.setAttribute("style", "display: none");
}

//search query function
let findMovies= function (){
    // api call
    fetch(`${baseURL}search/movie${apiKey}&query=${query}`)
    .then(response => response.json())
    .then( function(data){
        console.log(data);
        //loops through each object in the results response to show all posters
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
                
                //making poster
                const poster=document.createElement("img");
                let smallPosterPath=data.results[i].poster_path;
                poster.setAttribute("src", baseImgUrl+smallPosterURL+smallPosterPath);
                poster.setAttribute("class", "smallPoster");

                //adding all the necessary data into the activateModal onlick function
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

//onclick function so that when you click in the background of the modal it exits out.
window.onclick= function(event){
    if (event.target.className== 'modal-background'){
        movieModal.setAttribute("style", "display:none");
    }
}
// Or if you click the x button on the modal it also exits out. 
exitModal.onclick= function(){
    movieModal.setAttribute("style", "display:none");
}

// intializing key to 0. If there is something in local storage it gets the length of local storage. 
let key=0;
if(localStorage){
    key=localStorage.length;
}                                                  

//record favorite function. Sets poster path into local storage
let recordFavorite=function(smallPosterPath){
    
    //if the poster path is already in local storage do no set a duplicate into local storage
    for(let i=0; i<localStorage.length; i++){
        if (localStorage.getItem(localStorage.key(i))==smallPosterPath){
            return;
        }
    }
    localStorage.setItem(key, smallPosterPath);
    key++;
}

// function that checks the availability of the movie on a streaming service
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
            // if the movie is on a specific streaming platform the movie logo display is set to true. 
            let hboBoolean= data.streamingInfo.hasOwnProperty("hbo");
            let netflixBoolean= data.streamingInfo.hasOwnProperty("netflix");
            let primeBoolean= data.streamingInfo.hasOwnProperty("prime");
            let disneyBoolean= data.streamingInfo.hasOwnProperty("disney");
            let huluBoolean= data.streamingInfo.hasOwnProperty("hulu");

            // if the movie is on a specific streaming platform the movie logo display is set to true. 
            if(hboBoolean){
                hbo.setAttribute("style", "display: block");
            }
            if (netflixBoolean){
                netflix.setAttribute("style", "display: block");
            }
            if (primeBoolean){
                prime.setAttribute("style", "display: block");
            }
            if(disneyBoolean){
                disney.setAttribute("style", "display: block");
            }
            if(huluBoolean){
                hulu.setAttribute("style", "display: block");
            }
            if(!hboBoolean && !netflixBoolean && !primeBoolean && !disneyBoolean && !huluBoolean){
                none.setAttribute("style", "display: block");
            }
    
    });

});

