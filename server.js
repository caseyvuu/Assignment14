const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let cars = [{
    _id: 1,
    name: "BMW i8",
    price: "$147,500",
    engine: "turbocharged 1.5-liter three-cylinder gas engine",
    horsepower: "369 horsepower",
    mpg: "27",
    features: [
        "All Wheel Drive",
        "Heated Mirrors",
        "Intelligent Parking System",
        "Knee Airbags",
        "Leather Seat Trim",
    ]
},
{
    _id: 2,
    name: "Rolls-Royce Phantom",
    price: "$493,000",
    engine: "6.7 L V12",
    horsepower: "563 horsepower",
    mpg: "14",
    features: [
        "4-Corner Auto-Leveling Suspension",
        "Multiple Refrigerator Boxes",
        "Starlight Headliner",
        "Powered Footrests",
        "Privacy Suite",
    ]
},
{
    _id: 3,
    name: "Porsche 911",
    price: "$114,400",
    engine: "twin-turbo 3.0-liter flat-six-cylinder",
    horsepower: "640 horsepower",
    mpg: "18",
    features: [
        "Multifunction Steering Wheel",
        "PASM Sport Suspension",
        "Electric Sport Seats",
        "Door Puddle Lights",
        "Navigation Plus",
    ]
},
{
    _id: 4,
    name: "Quattroporte",
    price: "$139,000",
    engine: "3.8-liter V-8",
    horsepower: "424 horsepower",
    mpg: "19",
    features: [
        "Skyhook Suspensions",
        "Advanced Driver Assistance System",
        "Six Dual-Stage Airbags",
        "Wireless Charging Pad",
        "Adaptive Cruise Control",
    ]
},
{
    _id: 5,
    name: "Pagani Huayra",
    price: "$3,000,000",
    engine: "6.0 L (5,980 cc) twin-turbocharged M158 60° V12",
    horsepower: "791 horsepower",
    mpg: "10",
    features: [
        "Removable Carbon-Fiber Roof",
        "Bulletproof",
        "7-Speed Automated Manual",
        "Pirelli Tyres",
        "21-inch Rear Rims",
    ]
},
{
    _id: 6,
    name: "Audi R8",
    price: "$158,600",
    engine: "5.2 L V10 FSI",
    horsepower: "602 horsepower",
    mpg: "17",
    features: [
        "Racing Shell Seats",
        "Virtual Cockpit",
        "Carbon Fiber Engine Compartment",
        "Titanium Finish",
        "Ceramic Brakes",
    ]
},
];

app.get("/api/cars", (req, res) => {
    res.send(cars);
});

app.post("/api/cars", upload.single("img"), (req, res) => {
    const result = validateCar(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const car = {
        _id: cars.length + 1,
        name: req.body.name,
        engine: req.body.engine,
        horsepower: req.body.horsepower,
        price: req.body.price,
        mpg: req.body.mpg,
        features: req.body.features.split(",")
    }

    console.log(car);

    cars.push(car);
    res.send(cars);
});

const validateCar = (car) => {
    const schema = Joi.object({
        _id: Joi.optional(),
        name: Joi.string().min(1).required(),
        engine: Joi.string().required(),
        horsepower: Joi.string().required(),
        price: Joi.required(),
        mpg: Joi.required(),
        features: Joi.allow(""),
    });

    return schema.validate(car);
};

app.listen(3004, () => {
    console.log("I'm listening");
});