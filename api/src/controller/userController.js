const userModel = require("../model/userModel");
const mysql = require("../model/mysqlConnect");

exports.get = async (header) => {
    let res = await mysql.query(`SELECT * FROM user`);
    return res;
}

exports.post = async (body) => {
    let res = await userModel.register(body);
    return res;
}