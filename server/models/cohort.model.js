const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cohortSchema = new Schema({
   
   cohortSlug: {
    type: String,
    required: true,
    unique: true,
   },
   cohortName: {
    type: String,
    required: true,
   },
   program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
    required: true,
   },
   format: {
    type: String,
    enum: ["Full Time", "Part Time"],
    required: true,
   },
   campus: {
    type: String,
    enum: ["Madrid", "Barcelona", "Miami", "Paris", "Berlin", "Amsterdam", "Lisbon", "Remote"],
    required: true,
   },
   startDate: {
    type: Date,
    required: true,
   },
   endDate: {
    type: Date,
    required: true,
   },
   inProgress: {
    type: Boolean,
    default: false,
   }, 
   programManager: {
    type: Schema.Types.ObjectId,
    ref: "User",
   },
   leadTeacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
   },
   totalHours: {
    type: Number,
    default: 360,
   },
   
});

const Cohort = mongoose.model("Cohort", cohortSchema);

module.exports = Cohort;