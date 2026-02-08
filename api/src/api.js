const express = require("express");
const cors = require("cors");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(cors({origin: "*", credentials: true}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//====================== Rotas  =======================
const user = require("./routers/user");

app.use("/", user);

module.exports = app;
