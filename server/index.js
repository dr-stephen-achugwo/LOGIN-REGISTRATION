const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const EmployeeModel = require("./models/Employee");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
    origin: [
        'https://crud-mern-0zhi.onrender.com/', 
        'https://mern4.apps.net.ng/', 
        'https://crud-mern-client-khaki.vercel.app/', 
        'https://crud-mern-client-dr-stephens-projects.vercel.app/', 
        'https://crud-mern-client-git-main-dr-stephens-projects.vercel.app/'
    ], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // Allow credentials (like cookies) to be sent
}));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  app.use('/', (req, res) => {
    res.send('Server for Login & Registration is running!');
  });
}

main().then(() => console.log("Mongodb connected successfully!")).catch(err => console.log(err));

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          res.json("success");
        } else {
          res.json("the password is incorrect" + err.message);
        }
      });
    } else {
      res.json("no record is existed");
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      EmployeeModel.create({ name, email, password: hash })
        .then((employees) => res.json(employees))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.message)); // Handle any bcrypt error
});

app.listen(3001, () => {
  console.log("server is running");
});
