const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Oracle@13',
    database: 'quiz_app'
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
});

// REGISTER
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    db.query("INSERT INTO users (username,email,password) VALUES (?,?,?)",
        [username, email, password],
        (err) => {
            if (err) return res.send(err);
            res.send("Registered");
        });
});

// LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {
            if (result.length > 0) res.send(result[0]);
            else res.send({});
        });
});

// GET QUESTIONS
app.get('/questions', (req, res) => {
    db.query("SELECT * FROM questions", (err, result) => {
        res.send(result);
    });
});

// SAVE RESULT
app.post('/result', (req, res) => {
    const { user_id, score } = req.body;
    db.query("INSERT INTO results (user_id, score) VALUES (?,?)",
        [user_id, score],
        (err) => {
            if (err) return res.send(err);
            res.send("Result Saved");
        });
});

// GET RESULTS
app.get('/results/:id', (req, res) => {
    db.query("SELECT * FROM results WHERE user_id=?",
        [req.params.id],
        (err, result) => {
            res.send(result);
        });
});

app.listen(5000, () => console.log("Server running"));