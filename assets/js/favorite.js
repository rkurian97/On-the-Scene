const baseImgUrl= "https://image.tmdb.org/t/p/";
const smallPosterURL= 'w185';

const favoritesContainer= document.getElementById("favoritesContainer");




let loadFavorites=function(){

    for(let i=0; i<localStorage.length; i++){
        console.log(localStorage.getItem(localStorage.key(i)));
        //making column div container for each poster
        const imgDiv= document.createElement("div");
        imgDiv.setAttribute("class", "column is-one-fifth");
        favoritesContainer.append(imgDiv)

        //making another div for the gradient effect
        const gradientDiv= document.createElement("div");
        gradientDiv.setAttribute("class", "gradientDiv");
        imgDiv.append(gradientDiv);
        
        //making poster and adding its data into the activateModal function
        const poster=document.createElement("img");
        let smallPosterPath=localStorage.getItem(localStorage.key(i));
        poster.setAttribute("src", baseImgUrl+smallPosterURL+smallPosterPath);
        poster.setAttribute("class", "smallPoster");
        gradientDiv.append(poster);

    }
}

loadFavorites();