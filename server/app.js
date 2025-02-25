const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/student.model");
const Cohort = require("./models/cohort.model");

const PORT = process.env.PORT || 5005;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cohort-tools-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:



// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/client/index.html");
});

app.get("/client", (req, res) => { 
  res.sendFile(__dirname + "/views/client/index.html");
});

  app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get('/api/students', (req, res) => {
  mongoose.connection.db.collection('students').find({}).toArray()
    .then(students => {
      console.log('Students found:', students.length);
      res.json(students);
    })
    .catch(err => {
      console.error('Error fetching students:', err);
      res.status(500).json({ message: 'Error fetching students', error: err });
    });
});

app.get('/api/cohorts', (req, res) => {
  mongoose.connection.db.collection('cohorts').find({}).toArray()
    .then(cohorts => {
      console.log('Cohorts found:', cohorts.length);
      res.json(cohorts);
    })
    .catch(err => {
      console.error('Error fetching cohorts:', err);
      res.status(500).json({ message: 'Error fetching cohorts', error: err });
    });
});

// Add debug routes to directly query MongoDB
app.get('/api/debug/students', (req, res) => {
  mongoose.connection.db.collection('students').find({}).toArray()
    .then(students => {
      console.log('Raw students found:', students.length);
      res.json(students);
    })
    .catch(err => {
      console.error('Error fetching raw students:', err);
      res.status(500).json({ message: 'Error fetching raw students', error: err });
    });
});

app.get('/api/debug/cohorts', (req, res) => {
  mongoose.connection.db.collection('cohorts').find({}).toArray()
    .then(cohorts => {
      console.log('Raw cohorts found:', cohorts.length);
      res.json(cohorts);
    })
    .catch(err => {
      console.error('Error fetching raw cohorts:', err);
      res.status(500).json({ message: 'Error fetching raw cohorts', error: err });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});