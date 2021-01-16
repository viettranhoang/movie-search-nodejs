const cheerio = require('cheerio'); 
const request = require('request-promise');
const axios = require('axios')
const qs = require('qs');

class CommentController {

    getComments(req, res) {
        const fbCommentUrl = req.query.href

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
        fb_dtsg: 'AQE9eijzsAw5:AQFqRpyNADSI',
        limit: 50,
     };

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `https://www.facebook.com/plugins/comments/async/${fbId}/pager/reverse_time/`,
            data: qs.stringify(data),
            headers: {
                'cookie': 'dpr=2; sb=KjbMX9sq5tMUuqlMqFGD7kDz; datr=KjbMX6NAFGyBffAUIbXPfEW0; c_user=100004548421879; spin=r.1003186793_b.trunk_t.1610723498_s.1_v.2_; xs=15%3A613zlbtOIs9_Yg%3A2%3A1607275256%3A10982%3A6337%3A%3AAcXzVeEYehdL9IEbqozNmNXvP_48M6KPYnOMNXw9v5Y; fr=1bmBv2H35ouJJ5OYL.AWWHiMO3DmWnEi_SKJU5sIjGeIw.BfzDYq.e_.AAA.0.0.BgAoec.AWW9_FWQGss'},
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
