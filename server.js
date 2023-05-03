
const express = require('express');
const server = express();
const data = require('./Movie data/data.json');
const PORT = 3000;
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const movieData = require('./Movie data/data.json');
const apikey = process.env.apikey;
server.get('/', homeHandler)
server.get('/trending', trendingHandler)
server.get('/search', searchHandler)
server.get('/list', listHandler)
server.get('/discover', discoverHandler)
server.use(errorHandler)

function homeHandler(req, res) {
    const returnVal = {
        title: data.title,
        poster_path: data.poster_path,
        overview: data.overview,
    }
    res.send(returnVal)
}

function trendingHandler(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}&language=en-US`;
    
    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.results.map(item => {
                    let singleMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleMovie;
                })
                res.send(mapResult)

            })
            .catch((error) => {
                console.log('error', error)
                res.status(500).send(error);
            })

    }
    catch (error) {
        errorHandler(error, req, res, next)
    }
    
    
}



function searchHandler(req, res) {
    
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&language=en-US&query=The&page=2`;
    
    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.results.map(item => {
                    let singleMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleMovie;
                })
                res.send(mapResult)

            })
            .catch((error) => {
                console.log('error', error)
                res.status(500).send(error);
            })

    }
    catch (error) {
        errorHandler(error, req, res, next)
    }
    

}

function listHandler(req, res) {
    const url = `https://api.themoviedb.org/3/list/4?api_key=${apikey}&language=en-US`
    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.items.map(item => {
                    let singleMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleMovie;
                })
                res.send(mapResult)

            })
            .catch((error) => {
                console.log('error', error)
                res.status(500).send(error);
            })

    }
    catch (error) {
        errorHandler(error, req, res, next)
    }
}

function discoverHandler(req, res) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.results.map(item => {
                    let singleMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleMovie;
                })
                res.send(mapResult)

            })
            .catch((error) => {
                console.log('error', error)
                res.status(500).send(error);
            })

    }
    catch (error) {
        errorHandler(error, req, res, next)
    }
}

function Movie (id,title,release_date,poster_path,overview){
    this.id = id;
    this.title = title;
    this .release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function errorHandler(error, req, res, next) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err)
    
}

server.listen(PORT, () => {

});