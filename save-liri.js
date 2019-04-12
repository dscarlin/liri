require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios")
const moment = require("moment")
const Spotify = require("node-spotify-api")
const fs = require("fs")
const spotify = new Spotify(keys.spotify);
const inputArr = process.argv;
const searchCommand = inputArr[2]
const searchItem = inputArr.slice(3).join(" ")

function queryLIRI(command,query){
    if (command == 'concert-this')
        findConcert(query)   
    else if (command == 'spotify-this-song')
        searchSpotify(query)   
    else if (command == 'movie-this')
        movieThis(query);   
    else{
        console.log(    '\u001b[1;31mThe command entered was not recognized,' + 
                        '\r\n please be sure it is one of the following:\r\n\u001b[1;32m' + 
                        '   concert-this\r\n' + 
                        '   spotify-this-song\r\n' + 
                        '   movie-this\r\n' + 
                        '   do-what-it-says \u001b[0m'
        );
    }
};

function searchSpotify(songTitle){
    spotify
    .search({ type: 'track', query: songTitle })
    .then(function logSpotifyResult(response) {
        let result = ""
        response.tracks.items.forEach(function(item){
            item.preview_url = (item.preview_url) ? item.preview_url : "Not Available";
            let message =   "\r\n Track Name:\r\n   " + item.name +
                            "\r\n Artists:"
           
            item.artists.forEach(function(artist){
                message +=  "\r\n   "+ artist.name
            })
            message +=      "\r\n Preview:\r\n   " + item.preview_url +
                            "\r\n Album:\r\n   " + item.album.name + "\r\n"
            result += message
        })
        // console.log(result) 
        result += "\r\n\r\n\r\n"
        writeToFile(searchCommand, songTitle, result)
        if(response.tracks.items.length < 1){
           searchSpotify('The Sign Ace of Base')
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}

function findConcert(artist){
    axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(resp){
        if(resp.data.length > 0){
            let result = ""
            resp.data.forEach(function(item){
                let venue = item.venue;
                let date = moment(item.datetime, 'YYYY-MM-DDThh:mm:ss').format('MMMM Do YYYY, h:mma');
                let message =   "\r\n Location: " + item.venue.city + ", " + item.venue.country +
                                "\r\n   Venue: " + venue.name +
                                "\r\n   Date: " + date + "\r\n";
                result += message
                
            })
            // console.log(result);
            result += "\r\n\r\n\r\n"
            writeToFile(searchCommand, artist, result);
        }
        else
            console.log('\u001b[33mSorry, the search did not return any results.\u001b[0m')
    })
    .catch(function(err){
        // console.log(err);
        console.log('\u001b[1;31mOops there was an Error! \r\n   Be Sure that you enter a valid artist or\r\n   band name on the next try.\u001b[0m')

    })
};

function movieThis(movie){
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios
    .get(queryUrl)
    .then(function(response) {
        // console.log(response);  
        if (response.data.Error){
            movieThis('Mr Nobody')
            return;
        }
        else{
        let message =   "\r\nTitle: \r\n    " + response.data.Title +
                        "\r\nYear: \r\n    " + response.data.Year +
                        "\r\nIMDB Rating: \r\n    " + response.data.imdbRating +
                        "\r\nRotten Tomatoes Rating: \r\n    " + response.data.Ratings[1].Value +
                        "\r\nCountry of production: \r\n    " + response.data.Country + 
                        "\r\nLanguage: \r\n    " + response.data.Language +
                        "\r\nPlot: \r\n    " + response.data.Plot + 
                        "\r\nActors: \r\n    " + response.data.Actors + "\r\n\r\n\r\n";
        // console.log(message);
        writeToFile(searchCommand, movie, message);
        };
    })
    .catch(function(err){
        console.log(err);
    });
};

function writeToFile(searchType, query, data){
    let text =  searchType + " - " +
                query + "\r\n" +
                data;

    fs.appendFile("searchResults.txt", text, function(err){
        if(err)
            console.log('\u001b[1;31mOops, your data was not logged to the searchResults.txt file!\u001b[0m');
        else
            console.log('\u001b[1;32mYour results have been added to the searchResults.txt file!\u001b[0m');
    })
}

if (searchCommand == 'do-what-it-says'){
    fs.readFile('random.txt','utf8',function(error,data){
        if(error){
            console.log(error);
            return;
        };
        let inputArr = data.split(",")
        let searchType = inputArr[0]
        let searchQuery = inputArr[1]
        queryLIRI(searchType,searchQuery)
    })
}
else{
    queryLIRI(searchCommand, searchItem)
}







