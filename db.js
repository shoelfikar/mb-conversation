const mysql      = require('mysql2');
const connection = mysql.createConnection({
  host     :process.env.HOST,
  user     :process.env.USER,
  port     : 3306,
  password :process.env.PASSWORD,
  database :process.env.DATABASE,
});
 
connection.connect((err)=> {
  
  if(err) console.log(`Error database : ${err}`);
});

module.exports = connection;