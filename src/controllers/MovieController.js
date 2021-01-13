const cheerio = require('cheerio'); 
const request = require('request-promise');

class MovieController {

    getInfo(req, res) {
        var movieLink = req.params.link
       
        request(movieLink, (error, response, html) => {
  
            if(!error && response.statusCode == 200) {
                const $ = cheerio.load(html); 
            
                const movieName =  $('.movie-title').find('.title-1 a').text()
                const movieName2 =  $('.movie-title').find('.title-2').text()
                const movieYear =  $('.movie-title').find('.title-year').text()
                const movieCountry =  $('.country').text()
                const movieContent =  $('.content').find('p').text()
                const moviePoster =  $('.movie-l-img').find('img').attr('src')
                const facebookLink = $("div[class='fb-comments fb_iframe_widget fb_iframe_widget_fluid_desktop']").attr('data-href')
            
            
                var movie = {
                    movieName, movieName2, movieYear, movieContent, movieCountry, moviePoster, facebookLink
                }
                res.send(movie)
            }
            else {
                console.log(error);
            }
        });
    }

}

module.exports = new MovieController();
