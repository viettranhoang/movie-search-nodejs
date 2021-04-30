const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');
const Movie = require('../models/Movie')


const fbPageCommentUrl = 'https://www.facebook.com/plugins/feedback.php?href='
const phimmoiFBHref = "http://cmt.phimmoi.link/phim/"

const movieFilmUrl = 'http://www.phimmoizz.net/phim-le/'
const searchUrl = 'http://www.phimmoizz.net/tim-kiem/'

const hostPhimmoizz = "http://phimmoizz.net/"

const googleCacheUrl = "http://webcache.googleusercontent.com/search?vwsrc=0&q=cache:UfQchDUKmpwJ:"


class MovieController {

    async search(req, res) {
        // const pageUrl = searchUrl + encodeURI(req.query.q) + '/'

        // console.log(pageUrl);
        
        // const result = await crawlPage(pageUrl);


        const q = req.query.q
        Movie.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { globalName: { $regex: q, $options: "i" } },
            ],
        })
        .limit(30)
        .then((movies) => {
            res.send(movies)
        })
        .catch(err => {
            console.log(err);
        })
        
        // res.send(movies)
    }

    async trending(req, res) {
        Movie.find({})
            .limit(10)
            .then((movies) => {
                res.send(movies)
            })
            .catch(err => {
                console.log(err);
            })
    }

    info(req, res) {
        var movieLink = req.query.href
        var googleCachePhimmoiUrl = googleCacheUrl + movieLink

        axios.get(googleCachePhimmoiUrl)
        .then(function (response) {
            const $ = cheerio.load(response.data); 

            
            const name =  $('.movie-title').find('.title-1 a').text()

            console.log('fsfdsf' + response.data)

            const globalName =  $('.movie-title').find('.title-2').text()
            const year =  $('.movie-title').find('.title-year').text().trim().replace('(', '').replace(')', '')
            const imdb =  $('dd.movie-dd.imdb').eq(0).text()
            var numberOfVotes = $('dl.movie-dl').find('.movie-dd').eq(2).text().trim().replace('(', '').replace(')', '')
            if(!numberOfVotes.includes('votes')) numberOfVotes = 'IMDb'
            const country = 
                $('.country')
                    .map(function (i, el) {
                        // this === el
                        return $(this).text();
                    })
                    .get()
                    .join(', ');
            const content =  $('.content').find('p').text()
            const poster =  $('.movie-l-img').find('img').attr('src')
            const trailerUrl = $('.btn-film-trailer').attr('data-videourl')
            const facebookLink = $("div.fb-comments").attr('data-href')
        
        
            var movie = {
                name, globalName, year, imdb, numberOfVotes, content, country, poster, trailerUrl, facebookLink, movieLink
            }

            res.json(movie)
        })
        .catch(function (error) {
            console.log(error);
            res.send(error)
        })
    }

    infoTemp(req, res) {
        var movieLink = req.query.href

        
        const facebookLink = phimmoiFBHref + movieLink.substring(movieLink.lastIndexOf('-') + 1, movieLink.length)
    
    
        var movie = {
            facebookLink, movieLink
        }

        res.json(movie)
    }


    async crawl(req, res) {
        const fromPage = req.query.from - 1
        const toPage = req.query.to
        var movieLink = movieFilmUrl

        var totalMovies = []

        for(var i = fromPage; i < toPage; i++) {
            
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
        res.send("crawl success!!!")
    }

}

module.exports = new MovieController();

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
