const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');

const fbPageCommentUrl = 'https://www.facebook.com/plugins/feedback.php?href='

class CommentController {

    async getComments(req, res) {
        const fbCommentUrl = fbPageCommentUrl + req.query.href
        const fbCommentUrlOld = fbPageCommentUrl + req.query.movieUrl.replace('zz', '')

        var fbId = await getFbCommentId(fbCommentUrl)
        var comments = await getComments(fbId)

        var fbIdOld = await getFbCommentId(fbCommentUrlOld)
        var oldComments = await getComments(fbIdOld)

        var result = oldComments.concat(comments)
        res.send(result)
        // getFbCommentId(fbCommentUrl)
        // .then(fbId => getComments(fbId))
        // .then(comments => res.send(comments))
        // .catch(error => console.log(error))
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
        limit: 3,
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


                const commentIds = JSON.parse(data)['payload']['commentIDs'];
                for (const key in commentIds) {
                    if (Object.hasOwnProperty.call(commentIds, key)) {
                        const commentId = commentIds[key];

                        const commentJson = json[commentId]
                        var authorId = commentJson['authorID']
                        var comment = {
                            authorId: authorId,
                            authorName: json[authorId]['name'],
                            authorThumb: json[authorId]['thumbSrc'],
                            authorUri: json[authorId]['uri'],
                            content: commentJson['body']['text'],
                            timestamp: commentJson['timestamp']['time'],
                            filmId: commentJson['targetID'],
                        };

                        arr.push(comment)
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
