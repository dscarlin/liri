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
    command = command.trim();
    query = query.trim();
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
            let message =   "\r\n\u001b[1;36m Track Name:\r\n   \u001b[0m" + item.name +
                            "\r\n\u001b[1;36m Artists:"
           
            item.artists.forEach(function(artist){
                message +=  "\r\n   \u001b[0m"+ artist.name
            })
            message +=      "\r\n\u001b[1;36m Preview:\r\n   \u001b[0m" + item.preview_url +
                            "\r\n\u001b[1;36m Album:\r\n   \u001b[0m" + item.album.name + "\r\n"
            result += message
        })
        console.log(result)
        if(response.tracks.items.length < 1){
           searchSpotify('The Sign Ace of Base')
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}

function findConcert(artist){
    let regex = /\":"\':'/gi
    
    console.log("artist" + artist)
    axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(resp){
        if(resp.data.length > 0){
            let result = ""
            resp.data.forEach(function(item){
                let venue = item.venue;
                let date = moment(item.datetime, 'YYYY-MM-DDThh:mm:ss').format('MMMM Do YYYY, h:mma');
                let message =   "\r\n\u001b[1;36m Location: " + item.venue.city + ", " + item.venue.country +
                                "\r\n\u001b[0m   Venue: " + venue.name +
                                "\r\n\u001b[0m   Date: " + date + "\r\n";
                result += message
                
            })
            console.log(result);
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
    console.log('movie' + movie)
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
        let message =   "\r\n\u001b[1;36mTitle: \r\n\u001b[0m    " + response.data.Title +
                        "\r\n\u001b[1;36mYear: \r\n\u001b[0m    " + response.data.Year +
                        "\r\n\u001b[1;36mIMDB Rating: \r\n\u001b[0m    " + response.data.imdbRating +
                        "\r\n\u001b[1;36mRotten Tomatoes Rating: \r\n\u001b[0m    " + response.data.Ratings[1].Value +
                        "\r\n\u001b[1;36mCountry of production: \r\n\u001b[0m    " + response.data.Country + 
                        "\r\n\u001b[1;36mLanguage: \r\n\u001b[0m    " + response.data.Language +
                        "\r\n\u001b[1;36mPlot: \r\n\u001b[0m    " + response.data.Plot + 
                        "\r\n\u001b[1;36mActors: \r\n\u001b[0m    " + response.data.Actors + "\r\n\r\n\r\n";
        console.log(message);
        };
    })
    .catch(function(err){
        console.log(err);
    });
};


if (searchCommand == 'do-what-it-says'){
    fs.readFile('random.txt','utf8',function(error,data){
        if(error){
            console.log(error);
            return;
        };
        let newData = data.split('"').join('');
        let inputArr = newData.split(",");
        inputArr = inputArr.map(function(item) {
            return item.replace(/\n/g,'');
          });
        for (let i=1; i < inputArr.length; i = i+2){
            let searchType = inputArr[i-1]
            let searchQuery = inputArr[i]
            // console.log(inputArr[i-1])
            // console.log(inputArr[i])
            queryLIRI(searchType,searchQuery);
        }
    })
}
else{
    queryLIRI(searchCommand, searchItem)
}







