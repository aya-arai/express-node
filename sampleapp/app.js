const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const client = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'secret',
  database: 'quotes',
  port: 3306
});

//top(file)
app.get('/', function(req,res){
  res.render('top.ejs')
});
//index(file)
app.get('/index', function(req,res){
  client.query(
    'SELECT * FROM items',
    (error, results) => {
      console.log(results);
      res.render('index.ejs', {items: results});
    }
  );
});
//new(file)
app.get('/new', (req, res) => {
  res.render('new.ejs');
});
app.post('/create', (req, res) => {
  // formのreq.body.itenName(名前属性値)に入力値が入っている
  client.query(
    // idはAUTO_INCREMENTを指定しているので指定不要
    'INSERT INTO items (name) VALUES (?)',
    [req.body.item],
    (error, results) => {
      res.redirect('/index');
    }
  );
});
//delete
app.post('/delete/:id', (req, res) => {
  client.query(
    'DELETE FROM items WHERE id=?',
    [req.params.id],
    (error, results) => {
      console.log(results);
      // 一覧画面にリダイレクト
      res.redirect('/index');
    }
  );
});
//update
app.get('/edit/:id', (req, res) => {
  client.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results)=> {
      // 取得結果の1件目を配列から取り出し
      res.render('edit.ejs', {item: results[0]});
    } 
  );
});
app.post('/update/:id', (req, res) => {
  client.query(
    'UPDATE items SET name=? WHERE id=?',
    [req.body.item,req.params.id],
    (error, results) => {
      res.redirect('/index');
    } 
  );
});

app.listen(3000);