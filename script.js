$.ajax({
    url: "https://api.themoviedb.org/3/movie/550?api_key=4a89b391bd7e8061087938f4b3404220",
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });