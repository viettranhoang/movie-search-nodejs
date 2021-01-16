const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');


const fbPageCommentUrl = 'https://www.facebook.com/plugins/feedback.php?href='


class MovieController {

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
       
        // request(movieLink, (error, response, html) => {
  
        //     if(!error && response.statusCode == 200) {
        //         const $ = cheerio.load(html); 
            
        //         const name =  $('.movie-title').find('.title-1 a').text()
        //         const globalName =  $('.movie-title').find('.title-2').text()
        //         const year =  $('.movie-title').find('.title-year').text()
        //         const imdb =  $('dd.movie-dd.imdb').text()
        //         const numberOfVotes =  $('dt.movie-dt.hidden').nextUntil('dt.movie-dt').text();
        //         const country = 
        //             $('.country')
        //                 .map(function (i, el) {
        //                     // this === el
        //                     return $(this).text();
        //                 })
        //                 .get()
        //                 .join(', ');
        //         const content =  $('.content').find('p').text()
        //         const poster =  $('.movie-l-img').find('img').attr('src')
        //         const trailerUrl = $('.btn-film-trailer').attr('data-videourl')
        //         const facebookLink = $("div.fb-comments").attr('data-href')
        //         var fbCommentUrl = fbPageCommentUrl + encodeURI(facebookLink);
            
            
        //         var movie = {
        //             name, globalName, year, imdb, numberOfVotes, content, country, poster, trailerUrl, facebookLink, fbCommentUrl
        //         }

        //         res.json(movie)
        //     }
        //     else {
        //         console.log(error);
        //         res.send(error)
        //     }
        // });
    }
}

module.exports = new MovieController();
