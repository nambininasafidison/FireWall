import express from "express";
const home = express.Router();

home.get("/home", (req, res) => {
  res.sendFile("home.html", {
    root: path.join(__dirname, "..", "public/assets/home"),
  });
});
home.get("/add", (req, res) => {
  res.sendFile("add.html", {
    root: path.join(__dirname, "..", "public/assets/add"),
  });
});
home.get("/list", (req, res) => {
  res.sendFile("list.html", {
    root: path.join(__dirname, "..", "public/assets/list"),
  });
});


export default home;
