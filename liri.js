
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
//get information reg specified song.

function getSongInfo(songName){
    //For loop ensures that if song name is longer than 1 word then all the words in the song stay on the same line.
    for (var i = 3; i < input.length; i++) {
        songName = songName + "" + input[i];
    }
    //console.log(songName);
    //Line Break for log.txt file organization
    logData(
        "=========================================================================="
    );
    //log command to log.txt
    logData("liri command: spotify-this-song");
    //var spotify = new Spotify(keys.spotify);
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

    //If no song is specified on CLI, show song info for "The Waiting" by the Mowgli's by default.
    if(!songName) {
        //If no song is specified, set the songName variable the "The Waiting"
        songName = "The Waiting";
    }

    //Use the figlet npm package to convert songName text to art or drawing.
    figlet(songName, function (err, data){
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(data);
    });

    //Use the Spotify package to search for a song/track. Set results limit to 10
    spotify.search({ type: "track", query: songName, limit: 10 }, function(
        err,
        data
    )   {
        //If there is error log it.
        if(err) {
            return console.log("Error occured: " + err);
        }

        //JSON.stringify to print the data in string format.
        // JSON.stringify argument of "2" to make the format pretty.
        //console.log(JSON.stringify(data, null, 2));

        //If no song is provided, then the app will default to "The Waiting" by Tom Petty.
        if (songName === "The Waiting") {
            //output default song info
            var defaultSong =
            //Output Artist
            "Artist: " + 
            data.tracks.items[5].artists[0].name +
            "\r\n" +
            //Output song's name
            "Song title: " +
           data.tracks.items[5].name +
           "\r\n" +
           //Output a preview link of song from Spotify
           "Preview song: " +
           data.tracks.items[5].preview_url +
           "\r\n" +
           //Output Album that song is from
           "Album: " +
           data.tracks.items[5].album.name +
           "\r\n";

           //Output Default song info to terminal

          console.log(defaultSong);
          console.log(addedToLogFile);
          //Output default song info to log.txt file
          logData(defaultSong);
          logData(
            "=========================================================================="
            );
        }

        //If song name is provided, output first 10 songs with that name
        else {
            console.log("Top 10 songs on Spotify with the name," + songName);
            logData("Top 10 songs on Spotify with the name, " + songName);
            //Loop through the JSON data to display the top songs.
            for (var i = 0; i < data.tracks.items.length; i++) {
                var trackInfo = data.tracks.items[i];

                //Create variable for song preview link. 
                var previewSong = trackInfo.preview_url;
                //If song preview is null (N/A), tell user it is (N/A)
                if (previewSong === null) {
                    previewSong = "Song preview is N/A for this song.";
                }
                //output the song result. 
                var songResults =
                //Line Break to keep log.txt file clean
                "==========================================================================" +
          "\r\n" +
          //Display song number for each song. For example, the first song returned will be Song #1, etc.
          "Song #" +
          (i + 1) +
          "\r\n" +
          //Output artist
          "Artist: " +
          trackInfo.artists[0].name +
          "\r\n" +
          //Output song's name.
          "Song title: " +
          trackInfo.name +
          "\r\n" +
          //Output a preview link of song from Spotify.
          "Preview song: " +
          previewSong +
          "\r\n" +
          //Output the album that song is from.
          "Album: " +
          trackInfo.album.name +
          "\r\n" +
          //Line break to keep log.txt file clean and organized.
          "==========================================================================";

        //This will display song info.
        console.log(songResults);
        //Display song info in log.txt file.
        logData(songResults);
      }
    }
  });
}

//doWhatItSays function...
//If the liriCommand is do-what-it-says, take the text inside of random.txt and then use it to run spotify-this-song for "I want it that way."
function doWhatItSays() {
    //this code reads from the random.txt file
    //Important to include the utf8 parameter or code will provide stream data which is trash
    //code stores the content of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function(error, data){
        //If code experiences any errors it logs error to console
        if (error) {
            return console.log(error);
        }
        //we then print contents of data
        //console.log(data);

        //Then split by commas to make readable
        var songdataArray = data.split(",");

        //Re-display contents as array
        //console.log(songdataArray);
        //console.log(songdataArray[1]);
        //Call the getSongInfo function to display the song info for "I want it that way."
        getSongInfo(songdataArray[1]);
    });
}
//Output  to a .txt file called log.txt
function logData(logResults) {
    //Append contents to file
    //If file doesn;t exist it gets created on fly 
    fs.appendFile("log.txt", logResults + "\r\n", function(err) {
        if (err) {
            console.log(err);
        }

        //If no error we will log Content added
        else {
            //console.log("Content Added!");
        }
    });
}

//Function to show command line help.

function showHelp() {
    //use figlet npm to convert text to art/drawing
    figlet("LIRI help", function(err, data) {
        if(err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(data);
    });
    var helpInfo = "Usage: node liri.js <command> [arguments]";
    var helpColumns = [
        {
            Command: "movie-this [movie_name]",
            Description:
            "Shows information about the specified movie. If no movie is specified, Mr. Nobody is displayed by default."
        },
        {
            Command:"spotify-this-song [song_name]",
            Description:
            "Shows the top 10 songs on Spotify for the song, 'I want it that way.'"
        }
    ];
    console.log(
        "=================================================================================================="
      );
      console.log(helpInfo);
      console.log(
        "=================================================================================================="
      );
      console.log(helpColumns);
    }












