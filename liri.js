
//Set variable with the dotenv package
require("dotenv").config();

//send requests to the OMDB API
var request = require("request");

//Spotify Package to send requests to the Spotify API
var Spotify = require("node-spotify-api");

//Using  a "Figlet Package" to create a drawing form the text!!
var figlet = require("figlet");

//fs for reading/writing files.
let fs = require("fs");

//Access All keys in the keys.js file
var keys = require("./keys.js");

//process.argv will print out and command line arguments
var input = process.argv;

//spotify-this-song, movie-this, do-what-it-says array
var liriCommand = input[2];

//movie-this variable to hold the movie name
var movieName= "";

//spotify-this-song variable to hold the song name.
var songName = "";

//variable that contains text file with information requested was added to log file.
var addedToLogFile = "Results added to log.txt file.";

//Output information about that movie if command is movie-this.
if (liriCommand === "movie-this") {
    getMovieInfo();
  }
//Display song information for the specified song when the command is "spotify-this-song"
else if (liriCommand==="spotify-this-song") {
    getSongInfo(songName);
}

//If do-what-it-says,  text inside of random.txt is used to run spotify-this-song for "I want it that way."
else if (liriCommand === "do-what-it-says"){
    //log to log.txt
    logData("liri command: do-what-it-says");
    doWhatItSays();
}

//If command is "help", display command line help page
else if (liriCommand === "help") {
    showHelp();
}

//If the user enters a command NOT available then notify user that command is not found.
else {
    console.log(
        "Command not found. Run 'node liri.js help' to see a list of available commands."
    );
}

//Run function to get movie info for the specified movie.
function getMovieInfo() {
    //If the movie name is linger than one word, join words together on one line so that movie name is all one string!
    //This is preferable to seperate lines for each word!
    for (var i =3; i < input.length; i++) {
        if (i > 2 && i < input.length) {
            movieName = movieName + "" + input[i];
        }
    }
//if no movie name is specified on the CLI then show the movie info for Mr. Nobody
if (!movieName){
    movieName = "Mr Nobody";
    console.log(
        "If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/ "
    );
    console.log("It's on Netflix!");
}

//figlet npm used to convert the MovieName text into a drawing.
figlet(movieName, function(err, data) {
    if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
    }
    console.log(data)
});

//Request OMDB API movieName value.
request(
    "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy",
    function(error, response, body) {
        //If the request is successful response status code should be 200)
        if (!error && response.statusCode === 200) {
            //Parse body of JSON object that holds movie data and display.
            var movieInfo = JSON.parse(body);
            //console.log(movieInfo);

            //Variable for Rotten Tomatoes Rating
            var tomatoRating = movieInfo.Ratings[1].Value;

            //movieName Output Info.
            var movieResult = "=======================================================================================================" +
            "\r\n" +
            //Output command plus movieName
            "liri command: movie-this" + movieName +
            "\r\n" + "=======================================================================================================" +
            "\r\n" +
            //Title of the Movie.
            "Title: " +
            movieInfo.Title + 
            "\r\n" + 
            //Year Movie Released
            "Year movie was released: " +
            movieInfo.Year +
            "\r\n" + 
            //IMDB Rating of the movie.
            "IMDB movie rating (out of 10): " +
            movieInfo.imdbRating +
            "\r\n" +
            //Rotten Tomatoes movie rating
            "Rotten Tomatoes Rating (out of 100%): " +
            tomatoRating +
            "\r\n" +
            //country where movie was produced
            "Filmed in: " + 
            movieInfo.Country +
            "\r\n" +
            //Language of the movie.
            "Language: " +
            movieInfo.Language +
            "\r\n" +
            //Movie Plot
            "Movie plot: " +
            movieInfo.Plot +
            "\r\n" +
            //Actors in Movie
            "Actors: " + 
            movieInfo.Actors +
            "\r\n" +
            //Line Break
            "=======================================================================================================";

            //Output the movie information to the terminal. 
            console.log(movieResult);

            //Output the movie information to the log.txt file

            logData(movieResult);
          }
        }
    );
}











let inquirer = require("inquirer");
let moment = require("moment");
moment().format();

let axios = require("axios");

var spotify = new Spotify(keys.spotify);


inquirer
    .prompt([
        {
            type: "input",
            message: "What is your name?",
            name: "username"

        },
        {
            type: "list",
            message: "What would you like to ask about: concerts, spotify songs, movies?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "choice"
        },
    ])

    .then(function(res) {
        if (res.choice === "concert-this") {
            console.log("\n================");
            console.log('\nWelcome ${res.username}');
            console.log("\n================");
            inquirer
            .prompt([
                {
                    type: "input",
                    message: "What artist are you interested in?",
                    name: "artist"
                }
             ]).then(function(result){
                 let artist = result.artist;

                 let queryUrl = "https://rest.bandsintown.com/artists/" + artists + "/events?app_id=codingbootcamp"

                 if(result.artist == ""){
                     console.log("Please, enter an artist");
                    } else {
                        axios.get(queryUrl).then(
                            function(response) {
                                for (let i = 0; i< response.length; i++) {
                                    let date = moment(response.data[i].datetime).format('MM/DD/YYYY')
                                    console.log("\n================");
                                    console.log('Venue name: ${response.data[i].venue.name}');
                                    console.log('Country: ${response.data[i].venue.country}');
                                    console.log('Date: ${date}');
                                    console.log("=================");
                                }
                                fs.appendFile("log.txt", '\nArtist: ${artist}', function (err){
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log('Artist ${artist.toUpperCase()} added to log.txt file!');
                                    }

                                });
                            })
                        }
                    })
            } else if (res.choice === "spotify-this-song"){
                console.log("\n=================");
                console.log('\nWelcome ${res.username}');
                console.log("\n=================");

                inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What track are you interested in?",
                        name: "track"
                    }
                ])
                .then(function (result){
                    if (result.track == "") {
                        result.track = "The Sign";
                        spotify
                        .search({ type: 'track', query: result.track})
                        .then(function(response){
                            console.log("\n=================");
                            console.log("\n=================");
                            console.log('Song: ${response.tracks.items[7].name}');
                            console.log('Artist: ${response.tracks.items[7].album.artists[0].name}');
                            console.log('Spotify Preview: ${response.tracks.items[7].albums.external_urls.spotify}');
                            console.log('Album: ${response.tracks.items[7].album.name}');
                            console.log('Release Year: ${response.tracks.items[7].album.release_date}');
                            console.log('Preview: ${response.tracks.items[7].preview_url}');
                            console.log("\n=================");

                            fs.appendFile("log.txt", '\nSong: ${result.track}', function (err){
                                if (err) {
                                    console.log(err);
                                }
                                else{
                                    console.log('Song ${result.track.toUpperCase()} added to log.txt file !');

                                }
                            });
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    } else {
                        spotify
                        .search({ type: 'track', query: result.track})
                        .then(function(response){
                            console.log("\n=================");
                            for (let i = 0; i < response.tracks.items.length; i++){
                                console.log("\n=================");
                                console.log('Song: ${response.tracks.items[i].name}');
                                console.log('Artist: ${response.tracks.items[i].album.artists[0].name}');
                                console.log('Spotify Preview: ${response.tracks.items[i].album.external_urls.spotify}');
                                console.log('Album: ${response.tracks.items[i].album.name}');
                                console.log('Release Year: ${response.tracks.items[i].album.release_date}');
                                console.log('Preview: ${response.tracks.items[i].preview_url}');
                                console.log("\n=================");
                            }
                            fs.appendFile ("log.txt", '\nSong: ${result.track}', function(err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log('Song ${result.track.toUpperCase()} added to log.txt file!');
                                }
                            });
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                })
            } else if (res.choice === "do-what-it-says") {
                fs.readFile("random.txt", "utf8", function (error, data){
                    if (error) {
                        return console.log(error);
                    }
                    spotify
                    .search({type: 'track', query: data})
                    .then(function(response){
                        console.log("\n=================");
                        for (let i = 0; i < response.tracks.items.length; i++) {
                            console.log("\n=================");
                            console.log('Song: ${response.tracks.items[i].name}');
                            console.log('Artist: ${response.tracks.items[i].album.artists[0].name}');
                            console.log('Spotify Preview: ${response.tracks.items[i].album.external_urls.spotify}');
                            console.log('Album: ${response.tracks.items[i].album.name}');
                            console.log('Release Year: ${response.tracks.items[i].album.release_date}');
                            console.log('Preview: ${response.tracks.items[i].preview_url}');
                            console.log("\n=================");
                        }
                        fs.appendFile("log.txt", '\nSong: ${data}', function (err){
                            if (err){
                                console.log(err)
                            }
                            else{
                                console.log('Song ${data.toUpperCase()} Added to log.txt file!');
                            }
                        });
                    })
                })
            }
            else if 
        }
    }
    )