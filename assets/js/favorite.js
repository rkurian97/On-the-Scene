const baseImgUrl= "https://image.tmdb.org/t/p/";
const smallPosterURL= 'w185';

const favoritesContainer= document.getElementById("favoritesContainer");




let loadFavorites=function(){

    for(let i=0; i<localStorage.length; i++){
        //making column div container for each poster
        const imgDiv= document.createElement("div");
        imgDiv.setAttribute("class", "column is-one-fifth");
        imgDiv.setAttribute("onclick", "remove(this)");
        imgDiv.setAttribute("id", localStorage.key(i));
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

let remove= function(ele){
    let element= ele;
    localStorage.removeItem(ele.id);
    element.remove();
}

loadFavorites();

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
