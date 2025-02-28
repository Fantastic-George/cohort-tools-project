// Load environment variables
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/student.model");
const Cohort = require("./models/cohort.model");

// Import auth routes
const authRoutes = require("./routes/auth.routes");

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
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);  // Exit if we can't connect to database
  });

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

// Mount auth routes
app.use("/auth", authRoutes);

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

//Student routes

app.post('/api/students', (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
  })
  .then(student => {
    res.status(201).json(student);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error creating student', error: err });
  });
});

app.get('/api/students', (req, res) => {
  Student.find()
    .populate('cohort')
    .then(students => {
      res.status(200).json(students);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error fetching students', error: err });
    });
});

app.get('/api/students/cohort/:cohortId', (req, res) => {
  Student.find({ cohort: req.params.cohortId })
    .populate('cohort')
    .then(students => {
      res.status(200).json(students);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error fetching students', error: err });
    });
});

app.get('/api/students/:studentId', (req, res) => {
  Student.findById(req.params.studentId)
    .populate('cohort')
    .then(student => {
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json(student);
    })
    .catch(err => { 
      res.status(500).json({ message: 'Error fetching student', error: err });
    });
});

app.put('/api/students/:studentId', (req, res) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
  .then(student => {
    res.status(201).json(student);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error updating student', error: err });
  });
});

app.delete('/api/students/:studentId', (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
  .then(student => {
    res.status(201).json(student);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error deleting student', error: err });
  });
});


//Cohort routes

app.post('/api/cohorts', (req, res) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
  .then(cohort => {
    res.status(201).json(cohort);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error creating cohort', error: err });
  });
});

app.get('/api/cohorts', (req, res) => {
  Cohort.find()
  .then(cohorts => {
    res.status(200).json(cohorts);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error fetching cohorts', error: err });
  });
});

app.get('/api/cohorts/:cohortId', (req, res) => {
  Cohort.findById(req.params.cohortId)
  .then(cohort => {
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    res.status(200).json(cohort);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error fetching cohort', error: err });
  });
});

app.put('/api/cohorts/:cohortId', (req, res) => {
  Cohort.findByIdAndUpdate(req.params.cohortId, req.body, { new: true })
  .then(cohort => {
    res.status(201).json(cohort);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error updating cohort', error: err });
  });
});

app.delete('/api/cohorts/:cohortId', (req, res) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
  .then(cohort => {
    res.status(201).json(cohort);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error deleting cohort', error: err });
  });
});



//Debug routes

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

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};

// Add error handling middleware last
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});