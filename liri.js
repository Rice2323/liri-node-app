require("dotenv").config();
var keys = require("./keys");


var request = require("request");
var fs = require("fs");
var moment = require("moment");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var songArtists = [];

var divider = "\n---------------------------------\n\n";

    
var findConcert = function (concert){
        var URL = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=84fc524aae41f220eb377593ac2943b8";

        request(URL, function(err, response, body){
            var concertJSON = JSON.parse(body);

            var concertData = [

                "Name of Venue: " + concertJSON[1].venue.name,
                "Venue Location: " + concertJSON[1].venue.city + ", " + concertJSON[1].venue.region,
                "Date: " + moment(concertJSON[1].datetime).format("lll")
            ].join("\n\n");

            fs.appendFile("log.txt", concertData + divider, function(err){
                if (err) throw err;
                console.log(concertData);
            });

        });
    };


    var findSong = function (song){
       spotify.search({type:  'track', query: song}, function(err, songJSON){

       for (var i = 0; i < songJSON.tracks.items[0].artists.length; i++) {
       songArtists.push(songJSON.tracks.items[0].artists[i].name);
       };
        var songData = [
            "Artist(s): " +  songArtists,
            "Title: " + songJSON.tracks.items[0].name,
            "Preview: " + songJSON.tracks.items[0].preview_url,
            "Album: " + songJSON.tracks.items[0].album.name
        ].join("\n\n");

        fs.appendFile("log.txt", songData + divider, function(err){
            if (err) throw err;
            console.log(songData);
        });
       });
    };

    var findMovie = function (movie){

        var URL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&type=movie&tomatoes=true&apikey=f9366c2";

        request(URL, function(err, response, body){
            var movieJSON = JSON.parse(body);

            var movieData = [

                "Title: " + movieJSON.Title,
                "Released Date: " + movieJSON.Released,
                "Rating: " + movieJSON.Rated,
                "Rotten Tomatoes Rating: " + movieJSON.Ratings[2].Value,
                "Produced in: " + movieJSON.Country,
                "Language: " + movieJSON.Language,
                "Plot: " + movieJSON.Plot, 
                "Actors: " + movieJSON.Actors 

            ].join("\n\n");

            fs.appendFile("log.txt", movieData + divider, function(err){
                if (err) throw err;
                console.log(movieData);
            });

        });

    };

    var findRandom = function (){
        fs.readFile("random.txt", "utf8", function(err, data){
            if (err){
                console.log(err);
            }
            var newSong = data.split(",");
            console.log(newSong[1]);
            findSong(newSong[1]);

        } );
        
    };


    

    var search = process.argv[2];
    var term = process.argv.slice(3).join(" ");

    if (search === "concert-this"){
        console.log("Searching for Concert");
        if(!term){
            term = "Childish Gambino";
            findConcert(term);
        }
       else{ findConcert(term);
       }
    }

    else if (search === "spotify-this-song"){
        console.log("Searching for Song");
        if(!term){
            term = "Mr. Lonely";
            findSong(term);
        }
        else {findSong(term);
        }
    }

    else if( search === "movie-this"){
        console.log("Searching for Movie");
        if(!term){
            term = "Mr. Nobody";
            findMovie(term);
        }

       else { findMovie(term);
       }
    }

    else if(search === "do-what-it-says"){
        console.log("Reading Text");
        findRandom();
    }

    else {
        console.log("ERROR ID 10 T!!! Please try again");
    };
    



