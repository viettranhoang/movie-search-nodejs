const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');


const fbPageCommentUrl = 'https://www.facebook.com/plugins/feedback.php?href='


class MovieController {

    getInfo(req, res) {
        var movieLink = req.query.href
       
        request(movieLink, (error, response, html) => {
  
            if(!error && response.statusCode == 200) {
                const $ = cheerio.load(html); 
            
                const movieName =  $('.movie-title').find('.title-1 a').text()
                const movieName2 =  $('.movie-title').find('.title-2').text()
                const movieYear =  $('.movie-title').find('.title-year').text()
                const movieCountry =  $('.country').text()
                const movieContent =  $('.content').find('p').text()
                const moviePoster =  $('.movie-l-img').find('img').attr('src')
                const facebookLink = $("div.fb-comments").attr('data-href')
            
            
                var movie = {
                    movieName, movieName2, movieYear, movieContent, movieCountry, moviePoster, facebookLink
                }

                var pluginCommentUrl = fbPageCommentUrl + encodeURI(facebookLink);

                getFbCommentId(pluginCommentUrl)
                    .then(fbId => getComments(fbId))
                    .then(comments => res.send(comments))
                    .catch(erroe => console.log(error))
               
            }
            else {
                console.log(error);
            }
        });
    }


    
}

function getFbCommentId(pluginCommentUrl) {
    
    return new Promise((resolve, reject) => {
        axios.get(pluginCommentUrl)
        .then(function (response) {
            var startIndex = response.data.indexOf('\"targetFBID\":\"') + 14
            var endIndex = response.data.indexOf('\"', startIndex + 1)
            var fbId = response.data.slice(startIndex, endIndex)
    
            resolve(fbId)
        })
        .catch(function (error) {
            reject(error)
        })
    })
}


function getComments(fbId) {

    const data = { 
        __a: 1,
        fb_dtsg: 'AQHB8W_NMbKo:AQFyeC1Bq6bq',
        limit: 50,
     };

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `https://www.facebook.com/plugins/comments/async/${fbId}/pager/reverse_time/`,
            data: qs.stringify(data),
            headers: {
                'cookie': 'sb=ulvUXjpVAuqSUL_mDxkPV74b; datr=vF_UXhhjsZJAu4xV6BB5J8nQ; x-referer=eyJyIjoiL2dyb3Vwcy9qMnRlYW0uY29tbXVuaXR5Lz9tdWx0aV9wZXJtYWxpbmtzPTE0MzEwNzg2MTA1NTc1ODgmbm90aWZfdD1ncm91cF9oaWdobGlnaHRzJm5vdGlmX2lkPTE2MDUyNTM1ODE1NDMwMzMmcmVmPW1fbm90aWYiLCJoIjoiL2dyb3Vwcy9qMnRlYW0uY29tbXVuaXR5Lz9tdWx0aV9wZXJtYWxpbmtzPTE0MzEwNzg2MTA1NTc1ODgmbm90aWZfdD1ncm91cF9oaWdobGlnaHRzJm5vdGlmX2lkPTE2MDUyNTM1ODE1NDMwMzMmcmVmPW1fbm90aWYiLCJzIjoibSJ9; c_user=100004548421879; spin=r.1003175049_b.trunk_t.1610424082_s.1_v.2_; xs=14%3ARj-iV6lDwzwUbg%3A2%3A1608688497%3A10982%3A6337%3A%3AAcXKVI-aEdfUNzWjm7G9Uq2qRKi8lx7KnrUMk-FOvfk; fr=015icqy1YKgZgAEWf.AWVNbZiD_yDwR3TqY2DzlPyjZds.BfftaB.8a.AAA.0.0.Bf_VRr.AWWYITqV9Ek',
                },
          })
            .then(function (response) {
                var data = response.data.replace("for (;;);", "");
                var json = JSON.parse(data)['payload']['idMap'];
        
                var arr = [];
    
                for (const key in json) {
                    if (Object.hasOwnProperty.call(json, key)) {
                        const element = json[key];
                        if(element['type'] == 'comment') {
                        
                            var authorId = element['authorID']
                            var comment = {
                                authorId: authorId,
                                authorName: json[authorId]['name'],
                                authorThumb: json[authorId]['thumbSrc'],
                                authorUri: json[authorId]['uri'],
                                content: element['body']['text'],
                                timestamp: element['timestamp']['time'],
                                filmId: element['targetID'],
                            };
        
                            arr.push(comment)
                        }
                    }
                }
                resolve(arr)
            })
            .catch(function (error) {
                reject(error)
            });
    })
}

module.exports = new MovieController();
