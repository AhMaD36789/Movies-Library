
const express = require('express');
const server = express();
//const data = require('./Movie data/data.json');
//process.env.PORT ||
const PORT =  3001;
const cors = require('cors');
server.use(cors());
require('dotenv').config();
const axios = require('axios');
//const movieData = require('./Movie data/data.json');
const pg = require('pg');
const apikey = process.env.apikey;
server.use(express.json());
const client = new pg.Client(process.env.databaseURL)

server.get('/', homeHandler)
server.get('/getmovies', getFavoriteHandler)
server.post('/addmovie', postFavoriteHandler)
server.get('/trending', trendingHandler)
server.get('/search', searchHandler)
server.get('/list', listHandler)
server.get('/discover', discoverHandler)
server.put('/Update/:id',updateHandler)
server.delete('/Delete/:id',deleteHandler)
server.get('/getmoviebyid', getbyidHandler)
server.use(errorHandler)

function updateHandler (req,res){
const {id} = req.params;
const updatedmovie = req.body;
const sql = `UPDATE movieList 
SET title=$1, release_date=$2, poster_path=$3, overview=$4, comments=$5
WHERE id=${id} RETURNING *;`

const arr=[updatedmovie.title,updatedmovie.release_date,updatedmovie.poster_path,updatedmovie.overview,updatedmovie.comments];
client.query(sql,arr)
.then(data=>{
    const sql = `SELECT * FROM movieList;`
    client.query(sql)
    .then(alldata=>{
        res.send(alldata.rows)
        })
        .catch(error=>{
            errorHandler(error, req , res)
            })
})
.catch((error)=>{
    errorHandler(error,req,res);
});
}

function deleteHandler (req,res){
    const {id} = req.params;
    const sql = `DELETE FROM movieList
    WHERE id=${id};`
    
    client.query(sql)
    .then(data=>{
        const sql = `SELECT * FROM movieList;`
    client.query(sql)
    .then(alldata=>{
        res.send(alldata.rows)
        })
        .catch(error=>{
            errorHandler(error, req , res)
            })

    })
    .catch((error)=>{
        errorHandler(error,req,res)
    });
}

function getbyidHandler (req,res){
    const id = req.query.id;
    const sql = `SELECT * FROM movielist WHERE id=${id};`;
    client.query(sql)
    .then(data=>{
        res.send(data.rows)
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
}

function homeHandler(req, res) {
    res.send("")
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
        errorHandler(error, req, res)
    }


}

function getFavoriteHandler(req, res) {
    const sql = `SELECT * FROM movielist`
    client.query(sql)
        .then(data => {
            res.send(data.rows);
        })
        .catch((error) => {
            errorHandler(error, req, res)
        })
}

function postFavoriteHandler(req, res) {
    const movies = req.body;
    const sql = `INSERT INTO movielist (title,release_date,poster_path,overview,comments) VALUES ($1,$2,$3,$4,$5)`;
    const value = [movies.title,movies.release_date,movies.poster_path,movies.overview,movies.comments];
    client.query(sql, value)
        .then(data => {
            res.send("Data added sucessfully");
        })
        .catch(error=>{
            errorHandler(error,req,res)
        })
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
        errorHandler(error, req, res)
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
        errorHandler(error, req, res)
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
        errorHandler(error, req, res)
    }
}

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err)

}
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(PORT)
        });
    });