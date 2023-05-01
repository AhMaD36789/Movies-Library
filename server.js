
const express = require('express');
const server = express();
const data = require('./Movie data/data.json');
const PORT =3000;
server.listen(PORT,()=>{

});

server.get('/', (req,res)=>{
    const returnVal= {
        title: data.title,
        poster_path:data.poster_path,
        overview: data.overview,
    }
    res.send(returnVal)
});

server.get('/favorite', (req,res)=>{
    res.send("Welcome to Favorite Page");
});

server.get('*', (req,res)=>{
    res.status(404).send("Page Not found")
});

server.use(function(err,req,res,text){
    res.status(500);
    res.send("internal server error")
})
