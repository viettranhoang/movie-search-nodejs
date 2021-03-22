const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');
const schedule = require('node-schedule');
const Movie = require('../models/Movie')

const movieFilmUrl = 'http://www.phimmoizz.net/phim-le/'
const hostPhimmoizz = "http://phimmoizz.net/"

module.exports = async function () {
    try {
        schedule.scheduleJob('0 0 */3 * * *', function(){
            console.log('Crawling...');
            crawl()
        });
  
    } catch (error) {
      console.log(error);
    }
  }

async function crawl() {

    var movieLink = ""

    var totalMovies = []

    for(var i = 0; i < 5; i++) {
        
        movieLink = movieFilmUrl + `page-${i + 1}.html`
        
        const result = await crawlPage(movieLink);
        const arr = totalMovies
        totalMovies = arr.concat(result)
        console.log(`crawled page ${i + 1}`);
    }

    
    const movie = new Movie()

    movie.collection.insertMany(totalMovies, { ordered: false })
        .catch(err => {
            console.log(err);
        })

}

async function crawlPage(pageUrl) {
    const movies = [];

    try {
        const response = await axios.get(pageUrl)
    
        const $ = cheerio.load(response.data); 

        $('.movie-item').each(function (i, elem) {
            var name = $(this).find('.movie-title-1').text()
            var globalName = $(this).find('.movie-title-2').text()
            var movieLink = hostPhimmoizz + $(this).find('a').attr('href')
            var thumbString = $(this).find('.movie-thumbnail').attr('style')
            var thumb = thumbString.substring(thumbString.indexOf('(') + 1, thumbString.indexOf(')'))
            var poster = thumb.replace(".thumb.", ".medium.")
            movies[i] = {
                name, globalName, movieLink, poster
            };
        });
    } catch (error) {
        console.log(error);
        return 'error'
    }
    

    return movies
}

