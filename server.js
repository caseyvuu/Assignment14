const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
    .connect("mongodb+srv://cv10:Mongoose123@cluster0.yeez4jc.mongodb.net/")
    .then(() => {
    console.log("connected to mongodb");
    })
    .catch((error) => console.log("couldn't connect to mongodb", error));

    app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const carSchema = new mongoose.Schema({
    name: String,
    engine: String,
    horsepower: String,
    price: String,
    mpg: String,
    img: String,
    features: [String],
});

const Car = mongoose.model("Car", carSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/cars", (req, res) => {
    getCars(res);
});

const getCars = async (res) => {
    const cars = await Car.find();
    res.send(cars);
};

app.get("/api/cars/:id", (req, res) => {
    getCar(res, req.params.id);
});

const getCar = async(res, id) => {
    const car = await Car.findOne({_id:id});
    res.send(car);
};

app.post("/api/cars", upload.single("img"), (req, res) => {
    const result = validateCar(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const car = new Car({
        name: req.body.name,
        engine: req.body.engine,
        horsepower: req.body.horsepower,
        price: req.body.price,
        mpg: req.body.mpq,
        features: req.body.features.split(","),
    })

    if(req.file){
        car.img = "images/" + req.file.filename;
    }

    createCar(res, car);
});

const createCar = async (res, car) => {
    const result = await car.save();
    res.send(car);
};

app.put("/api/cars/:id", upload.single("img"), (req, res) => {
    const result = validateCar(req.body);
    console.log(result);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateCar(req, res);
});

const updateCar = async (req, res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        engine: req.body.engine,
        horsepower: req.body.horsepower,
        price: req.body.price,
        mpg: req.body.mpg,
        features: req.body.features.split(","),
    }
    
    if(req.file){
        console.log(req.file.filename);
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const result = await Car.updateOne({_id:req.params.id}, fieldsToUpdate);
    const car = await Car.findById(req.params.id);

    res.send(car);
};

app.delete("/api/cars/:id", upload.single("img"), (req, res) => {
    removeCars(res, req.params.id);
});

const removeCars = async(res, id) => {
    const car = await Car.findByIdAndDelete(id);
    res.send(car);
};

const validateCar = (car) => {
    const schema = Joi.object({
        _id: Joi.optional(),
        name: Joi.string().min(1).required(),
        engine: Joi.string().required(),
        horsepower: Joi.string().required(),
        price: Joi.required(),
        mpg: Joi.required(),
        img: Joi.allow(""),
        features: Joi.allow(""),
    });

    return schema.validate(car);
};

app.listen(3000, () => {
    console.log("I'm listening");
});