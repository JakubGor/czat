const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbUrl =
  "mongodb+srv://Chat:chat12@shop-chfoj.mongodb.net/chat?retryWrites=true&w=majority";

mongoose.connect(dbUrl, err => {
  console.log("połączono z mongodb", err);
});

const Message = mongoose.model("Message", { name: String, message: String });

app.use(express.static(__dirname));

//pobranie wszystkich wpisów
app.get("/messages", (req, res) => {
  Message.find()
    .exec()
    .then(messages => {
      res.send(messages);
    });
});

//nowy wpis
app.post("/messages", (req, res) => {
  const message = new Message(req.body);
  message
    .save()
    .then(() => {
      io.emit("message", req.body);
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

const server = http.listen(3000, () => {
  console.log("serwer działa na porcie", server.address().port);
});

io.on("connection", () => {
  console.log("podłączył się użytkownik");
});
