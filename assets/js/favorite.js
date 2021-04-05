// urls
const baseURL = 'https://api.themoviedb.org/3/';
const baseImgUrl = "https://image.tmdb.org/t/p/";
const smallPosterURL = 'w185';
const bigPosterURL = 'w342';

const favoritesContainer= document.getElementById("favoritesContainer");

// movie modal elements
const favoriteModal = document.getElementById("favoriteModal");
const exitModal = document.getElementById("exitModal");
const modalPoster = document.getElementById("modalPoster");
const modalOverview = document.getElementById("modalOverview");
const modalRating = document.getElementById("modalRating");
const modalTitle = document.getElementById("modalTitle");
const modalReleaseDate = document.getElementById("modalReleaseDate");
const trashButton = document.getElementById("trash");

//Streaming elements
const availabilityButton = document.getElementById("availabilityButton");
const netflix = document.getElementById("netflix");
const hbo = document.getElementById("hbo");
const prime = document.getElementById("prime");
const disney = document.getElementById("disney");
const hulu = document.getElementById("hulu");
const none = document.getElementById("none");

// activating modal with all the movie info
function activateModal(title, overview, rating, bigPosterPath, releaseDate, id){
    modalTitle.innerHTML = title;
    modalOverview.innerHTML = overview;
    modalRating.innerHTML = "<strong>Rating: </strong>" + rating;
    modalReleaseDate.innerHTML = "<strong>Release Date: </strong>" + releaseDate;
    modalPoster.setAttribute("src", bigPosterPath);

    favoriteModal.setAttribute("style", "display:flex");
    availabilityButton.setAttribute("data-id", JSON.stringify(id));
    trashButton.setAttribute("onclick", "removeFav( "+JSON.stringify(id)+");"); //attaching remove favorite function as an onclick to the trash button

    //every time a new poster is clicked initializing the display of the streaming logos to none. When the availability button is clicked it will repopulate based on the new movie clicked
    hbo.setAttribute("style", "display: none");
    netflix.setAttribute("style", "display: none");
    prime.setAttribute("style", "display: none");
    disney.setAttribute("style", "display: none");
    hulu.setAttribute("style", "display: none");
    none.setAttribute("style", "display: none");
}

// create an img div
function createImgDiv(){
    const imgDiv= document.createElement("div");
    imgDiv.setAttribute("class", "column is-one-fifth");
    return imgDiv;
}

// create a gradient div
function createGradientDiv(){
    const gradientDiv= document.createElement("div");
    gradientDiv.setAttribute("class", "gradientDiv");
    return gradientDiv;
}

// creating the poster
function createPoster(data){
    //making poster and adding its data into the activateModal function
    let title = JSON.stringify(data.original_title);
    let overview = JSON.stringify(data.overview);
    let rating = JSON.stringify(data.vote_average);
    let bigPosterPath = JSON.stringify(baseImgUrl + bigPosterURL + data.poster_path)
    let releaseDate = JSON.stringify(data.release_date);
    let id = JSON.stringify(data.id);

    const poster=document.createElement("img");
    let smallPosterPath= data.poster_path;
    poster.setAttribute("class", "smallPoster");
    poster.setAttribute("src", baseImgUrl + smallPosterURL + smallPosterPath)
    poster.setAttribute('onclick', 'activateModal(' + title + ',' + overview + ',' + rating + ',' + bigPosterPath + ',' + releaseDate +  ',' + id +  ');');

    return poster
}

// request for a specific movie and add the poster to the page
function requestMovie(id){
    fetch(`${baseURL}movie/${id}${apiKey}`)
    .then(response => response.json())
    .then(function (data) {
        //making column div container for each poster
        const imgDiv= createImgDiv();
        favoritesContainer.append(imgDiv)

        //making another div for the gradient effect
        const gradientDiv= createGradientDiv();
        imgDiv.append(gradientDiv);

        const poster= createPoster(data);
        gradientDiv.append(poster);
    });
}

// Loads in all the favorite movies from local storage
function loadFavorites(){

    for(let i=0; i<localStorage.length; i++){

        let id= localStorage.getItem(localStorage.key(i));
        requestMovie(id);
    }
}
loadFavorites();


// Removes favorite
function removeFav(id){
    for(let i=0; i<localStorage.length; i++){
        if(localStorage.getItem(localStorage.key(i))==id){
            localStorage.removeItem(localStorage.key(i));
            location.reload();
        }
    }
}
/*------------NavBar Function ---------------------*/
document.addEventListener('DOMContentLoaded', () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

});


//onclick function so that when you click in the background of the modal it exits out.
window.onclick = function (event) {
    if (event.target.className == 'modal-background') {
        favoriteModal.setAttribute("style", "display:none");
    }
}
// Or if you click the x button on the modal it also exits out. 
exitModal.onclick = function () {
    favoriteModal.setAttribute("style", "display:none");
}


/*------------Start Streaming Availability ---------------------*/

// sets image of logo to true if that movie is available on that platform
function showStreaming(data) {
    console.log(data);
    // if the movie is on a specific streaming platform the movie logo display is set to true. 
    let hboBoolean = data.streamingInfo.hasOwnProperty("hbo");
    let netflixBoolean = data.streamingInfo.hasOwnProperty("netflix");
    let primeBoolean = data.streamingInfo.hasOwnProperty("prime");
    let disneyBoolean = data.streamingInfo.hasOwnProperty("disney");
    let huluBoolean = data.streamingInfo.hasOwnProperty("hulu");

    // if the movie is on a specific streaming platform the movie logo display is set to true. 
    if (hboBoolean) {
        hbo.setAttribute("style", "display: block");
    }
    if (netflixBoolean) {
        netflix.setAttribute("style", "display: block");
    }
    if (primeBoolean) {
        prime.setAttribute("style", "display: block");
    }
    if (disneyBoolean) {
        disney.setAttribute("style", "display: block");
    }
    if (huluBoolean) {
        hulu.setAttribute("style", "display: block");
    }
    if (!hboBoolean && !netflixBoolean && !primeBoolean && !disneyBoolean && !huluBoolean) {
        none.setAttribute("style", "display: block");
    }

}

// event listener function that checks the availability of the movie on a streaming service
availabilityButton.addEventListener("click", function () {

    let id = availabilityButton.getAttribute("data-id");
    fetch(`https://streaming-availability.p.rapidapi.com/get/basic?country=us&tmdb_id=movie%2F${id}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "4e9ad7e5a5msh0a57503ac951c9dp1d772fjsn68cba4b29124",
            "x-rapidapi-host": "streaming-availability.p.rapidapi.com"
        }
    })
        .then(response => response.json())
        .then(data => showStreaming(data));
});

/*------------End Streaming Availability ---------------------*/

function myButton() {
    var element = document.body;
    element.classList.toggle("dark-mode");
 }
