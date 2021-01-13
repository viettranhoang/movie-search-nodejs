const express = require('express')
const axios = require('axios')
const qs = require('qs');

const Comment = require('../src/models/Comment');

const app = express();

const port = process.env.PORT || 3000;

const route = require('./routes');
route(app);

const data = { 
    __a: 1,
    fb_dtsg: 'AQHB8W_NMbKo:AQFyeC1Bq6bq',
    limit: 50,
 };


app.get('/', function (req, res) {

    axios({
        method: 'post',
        url: 'https://www.facebook.com/plugins/comments/async/3202987526461363/pager/reverse_time/',
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
        res.json(arr)

        })
        .catch(function (error) {
            res.send(error)
        });
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
