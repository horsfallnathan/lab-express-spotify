const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
// Remember to insert your credentials here
const clientId = '5db961ec4b36430686c340064a9e586c',
    clientSecret = '36b797c027fe4b4c8e969310634656be';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// the routes go here:

hbs.registerPartials(`${__dirname}/views/partials`);

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res) => {
    const query = req.query.artistSearch;
    spotifyApi
        .searchArtists(query)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            let artist = data.body.artists.items;
            res.render('artists', { artist });
        })
        .catch(err => {
            console.log('The error while searching artists occurred: ', err);
        });
});

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params;
    spotifyApi.getArtistAlbums(artistId).then(
        function(data) {
            console.log('Artist albums', data.body.items);
            let album = data.body.items;
            res.render('album', { album });
        },
        function(err) {
            console.error(err);
        }
    );
});
// app.get('/tracks/:trackId', (req, res, next) => {
//     const { trackId } = req.params;
//     spotifyApi.getAlbumTracks(trackId, { limit: 5, offset: 1 }).then(
//         function(data) {
//             console.log('Tryna get track list', data);
//             // let tracks = data.body.items;
//             res.render('tracks', { tracks });
//         },
//         function(err) {
//             console.log('Something went wrong!', err);
//         }
//     );
// });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
