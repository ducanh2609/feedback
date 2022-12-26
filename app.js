const express = require("express");
const fs = require("fs");
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const app = express();
const morgan = require("morgan");
var upload = multer();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.array());
app.use(express.static('public'));
app.use(morgan());
app.use(cors());

function checkExits(req, res, next) {
    var data = fs.readFileSync("./dev-data/feedbacks.json", { encoding: "utf8" });
    switch (req.method) {
        case "POST":
            var content = JSON.parse(data).find(item => item.content == req.body.content);
            if (content == undefined) next()
            else res.json({ message: "Feedback already exists" });
            break;
        default:
            if (req.params.id != undefined) {
                var check = JSON.parse(data).find(item => item.id == req.params.id);
                if (check != undefined) next()
                else res.json({ message: "Feedback not found" });
                break;
            }
    }
}

app.get("/", (req, res) => {
    res.sendFile("feedback.html", { root: './public' })
})

app.get('/api/v1/feedbacks', (req, res) => {
    fs.readFile('./dev-data/feedbacks.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.send(JSON.parse(data));
    })
})

app.get('/api/v1/feedbacks/:id', checkExits, (req, res) => {
    fs.readFile('./dev-data/feedbacks.json', 'utf8', (err, data) => {
        if (err) throw err;
        let result = JSON.parse(data).find(item => item.id == id);
        res.send(result);
    })
})

app.post('/api/v1/feedbacks', checkExits, (req, res) => {
    fs.readFile('./dev-data/feedbacks.json', (err, data) => {
        if (err) throw err;
        let dataPars = JSON.parse(data);
        dataPars.push(req.body);
        fs.writeFileSync('./dev-data/feedbacks.json', JSON.stringify(dataPars));
        res.json({ message: "Create successfully" });
    })
})

app.put('/api/v1/feedbacks/:id', checkExits, (req, res) => {
    let id = req.params.id;
    fs.readFile('./dev-data/feedbacks.json', (err, data) => {
        if (err) throw err;
        let dataPars = JSON.parse(data);
        for (let i = 0; i < dataPars.length; i++) {
            if (dataPars[i].id == id) {
                dataPars[i] = req.body;
                break;
            }
        }
        fs.writeFileSync('./dev-data/feedbacks.json', JSON.stringify(dataPars));
        res.json({ message: "Update successfully" });
    })
})

app.delete('/api/v1/feedbacks/:id', checkExits, (req, res) => {
    let id = req.params.id;
    fs.readFile('./dev-data/feedbacks.json', (err, data) => {
        if (err) throw err;
        let dataPars = JSON.parse(data);
        for (let i = 0; i < dataPars.length; i++) {
            if (dataPars[i].id == id) {
                dataPars.splice(i, 1);
                break;
            }
        }
        fs.writeFileSync('./dev-data/feedbacks.json', JSON.stringify(dataPars));
        res.json({ message: "Delete successfully" });
    })
})

app.listen(3000);