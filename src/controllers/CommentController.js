const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');

const fbPageCommentUrl = 'https://www.facebook.com/plugins/feedback.php?href='

class CommentController {

    async getComments(req, res) {
        const newUrl = req.query.href // http://cmt.phimmoi.link/phim/12281/
        const fbCommentUrl = fbPageCommentUrl + newUrl
        const fbCommentUrlOld = fbPageCommentUrl + req.query.movieUrl.replace('zz', '')

        try {
            var comments = [];
            if(newUrl) {
                var fbId = await getFbCommentId(fbCommentUrl)
                var comments = await getComments(fbId)
            }

            var fbIdOld = await getFbCommentId(fbCommentUrlOld)
            var oldComments = await getComments(fbIdOld)

            var result = comments.concat(oldComments)
            res.send(result)
        } catch (error) {
            console.log(error)
            res.send("")
        }
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
        limit: 70,
    };

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'PostmanRuntime/7.26.8'
    }

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `https://www.facebook.com/plugins/comments/async/${fbId}/pager/reverse_time/`,
            data: qs.stringify(data),
            headers: headers
        })
        .then(function (response) {
            var data = response.data.replace("for (;;);", "");
            console.log('fb id '+ fbId + ' comment data' + data);
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
