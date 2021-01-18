const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');

const fbPageCommentUrl = 'https://www.facebook.com/plugins/feedback.php?href='

class CommentController {

    getComments(req, res) {
        const fbCommentUrl = fbPageCommentUrl + req.query.href

        getFbCommentId(fbCommentUrl)
        .then(fbId => getComments(fbId))
        .then(comments => res.send(comments))
        .catch(error => console.log(error))
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
        limit: 50,
     };

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `https://www.facebook.com/plugins/comments/async/${fbId}/pager/reverse_time/`,
            data: qs.stringify(data),
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

module.exports = new CommentController();
