const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');


const fbPageCommentUrl = 'https://www.facebook.com/plugins/feedback.php?href='

const movieFilmUrl = 'http://www.phimmoizz.net/phim-le/'
const searchUrl = 'http://www.phimmoizz.net/tim-kiem/'


class MovieController {

    async search(req, res) {
        const pageUrl = searchUrl + req.query.q + '/'

        console.log(pageUrl);
        
        const result = await crawlPage(pageUrl);
        
        res.send(result)
    }

    info(req, res) {
        var movieLink = req.query.href

        axios.get(movieLink)
        .then(function (response) {
            const $ = cheerio.load(response.data); 
            
            const name =  $('.movie-title').find('.title-1 a').text()
            const globalName =  $('.movie-title').find('.title-2').text()
            const year =  $('.movie-title').find('.title-year').text()
            const imdb =  $('dd.movie-dd.imdb').text()
            const numberOfVotes =  $('dt.movie-dt.hidden').nextUntil('dt.movie-dt').text();
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
            var fbCommentUrl = fbPageCommentUrl + encodeURI(facebookLink);
        
        
            var movie = {
                name, globalName, year, imdb, numberOfVotes, content, country, poster, trailerUrl, facebookLink, fbCommentUrl
            }

            res.json(movie)
        })
        .catch(function (error) {
            console.log(error);
            res.send(error)
        })
    }

    async crawl(req, res) {
        var movieLink = movieFilmUrl

        var totalMovies = []

        for(var i = 0; i < 100; i++) {
            if(i != 0) {
                movieLink = movieFilmUrl + `page-${i}.html`
            }
            const result = await crawlPage(movieLink);
            const arr = totalMovies
            totalMovies = arr.concat(result)
            console.log(`crawled page ${i}`);
        }
        
        res.send(totalMovies)
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
            var url = $(this).find('a').attr('href')
            var thumbString = $(this).find('.movie-thumbnail').attr('style')
            var thumb = thumbString.substring(thumbString.indexOf('(') + 1, thumbString.indexOf(')'))
            movies[i] = {
                name, globalName, url, thumb
            };
        });
    } catch (error) {
        console.log(error);
        return 'error'
    }
    

    return movies
}
