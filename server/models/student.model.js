const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    linkedinUrl: {
        type: String,
        default: "",
    },
    languages: {
        type: [String],
        enum: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"],
        required: true,
    },
    program: {
        type: String,
        enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
        required: true,
    },
    background: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "https://i.imgur.com/r8bo8u7.png",
    },
    cohort: {
        type: Schema.Types.ObjectId,
        ref: "Cohort",
    },
    projects: {
        type: [Schema.Types.ObjectId],
        ref: "Project",
    },

});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;