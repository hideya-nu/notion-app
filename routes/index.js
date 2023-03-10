var express = require('express');
const { Client } = require('@notionhq/client');
var router = express.Router();

secret_key = 'secret_JF9kCsSLYfNEXyjBu7whuh7GmeqkPmtvb2Umy4Q1KCh'
db_id = '22b688a6058246f5afb0c5a07410e9ab'

var router = express.Router();
const notion = new Client({
  auth: secret_key,
})

/* GET home page. */
router.get('/', function(req, res, next) {
  notion.databases.query({
    database_id: db_id,
  }).then(resp=>{

    const values = [];
    for (var n in resp.results){
     var item = resp.results[n].properties;
      try {
        var val = [
          item['名前'].title[0].plain_text,
          item['点数'].number,
          item  ['ステータス'].status.name,
          item['分類'].select.name
        ];
        values.push(val);
      }catch(e){
        console.error(e);
      }
    }
    res.render('index', { title: 'Express',data: values });
  });
});

router.post('/', function(req, res, next) {
  const parent = {type:'database_id', database_id: db_id}
  const props = {
    '名前': {title: [{text:{content: req.body.name}}]},
    '点数': {type: 'number', number: +req.body.score},
    'ステータス': {type: 'status', text: +req.body.status},
    '分類': {type: 'select', text: +req.body.type}
  }
  notion.pages.create({
    parent: parent,
    properties: props
  }).then(resp=>{
    res.redirect('/');
  });
});

module.exports = router;
