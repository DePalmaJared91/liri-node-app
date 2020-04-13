require("dotenv").config();
var keys = require("./keys.js");
let inquirer = require("inquirer");
let moment = require("moment");
moment().format();
let fs = require("fs");
let axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);