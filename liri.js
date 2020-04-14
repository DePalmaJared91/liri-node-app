require("dotenv").config();
var keys = require("./keys.js");
let inquirer = require("inquirer");
let moment = require("moment");
moment().format();
let fs = require("fs");
let axios = require("axios");
var Spotify = require('node-spotify-api');
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