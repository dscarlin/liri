# liri
##### A language interpretation and recognition interface



## Technologies used:
- node.js
- omdb api
- node-spotify-api
- bands in town api
- moment
- axios
- dotenv

## What is liri?
- liri is a command-line node.js interface that will take the following four commands:

        concert-this <name of Artist or band>
        movie-this <movie title>
        spotify-this-song <song title>
        do-what-it-says 
        

## Getting Started:
- fork this repo and clone it locally
- create a file named .env in the root directory
- you will need to set up a developer account with the spotify api
- in the .env file you will need to enter credentials for your spotify account as follows:

          #Spotify API keys
          SPOTIFY_ID=your_spotify_id_here
          SPOTIFY_SECRET=your_spotify_secret_here

## Using liri:

- The first three commands are the main function of this application.
- The fourth command <do-what-it-says> will read the random.txt file and execute
        any commands that it contains which are written in the proper syntax.
    
- Saving the information would be nice too right? But you probably don't want to save every result
        that you search for.
- Once you run a query that returns results you would like to save, then run the same command on the save-liri.js file, and your results will be stored in a file named searchResults.txt!

- Don't worry if you make a mistake, most errors will result in a colorized error message indicating how to correct the issue!

- Commands are executed as follows:
        
        node liri.js command-name <parameter> 

###  example 1:
            node liri.js movie-this tron
            node save-liri.js movie-this tron
            node liri.js wrong-command
            node liri.js concert-this green day
            node liri.js spotify-this-song your song

![tron search result](/images/movieAndSpotify.png)
   
#####note: 
- parameters entered at the command line can
                   be wrapped in quotes or entered without quotes

### example 2: 
    node liri.js concert-this victor wooten

 ![victor wooten search result](/images/concert-this.png)

### example 3:
    node liri.js do-what-it-says
- in this example the file random.txt contains:
                spotify-this-song,"I Want it That Way"

![do-what-it-says command result](/images/do-what-it-says.png)

- this file can contain multiple commands in the format:


        spotify-this-song,"I Want it That Way",concert-this,victor wooten,movie-this,"tron" 
                                           


#####note: 

- this format requires no spaces or new lines 

- parameters for concert-this must not be wrapped in quotes
                  
- there must be no comma at the end of the string

## Contributions:
1. Fork it
2. Use it
3. Build on it
4. Send a pull request

                          




                            

        
        


    

    




