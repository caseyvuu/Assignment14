const getCars = async() => {
    try {
        return (await fetch("api/cars")).json();
    } catch (error) {
        console.log(error);
    }
}

const showCars = async() => {
    let cars = await getCars();
    let carsDiv = document.getElementById("car-list");
    carsDiv.classList.add("flex-container");
    carsDiv.classList.add("wrap");
    carsDiv.innerHTML = "";
    
    cars.forEach((car) => {
        const section = document.createElement("section");
        section.classList.add("car");
        carsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = car.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            document.getElementById("hide-details").classList.remove("hidden");
            displayDetails(car);
        };
    });
};

const displayDetails = (car) => {
    const carDetails = document.getElementById("car-details");
    carDetails.innerHTML = "";
    carDetails.classList.add("flex-container");

    const h3 = document.createElement("h3");
    h3.innerHTML = car.name;
    carDetails.append(h3);
    h3.classList.add("pad-this");

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    carDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    carDetails.append(eLink);
    eLink.id = "edit-link";

    const p1 = document.createElement("p");
    carDetails.append(p1);
    p1.innerHTML =  'Engine: ' + car.engine;
    p1.classList.add("pad-this");

    const p2 = document.createElement("p");
    carDetails.append(p2);
    p2.innerHTML = 'Horsepower: ' + car.horsepower;
    p2.classList.add("pad-this");

    const p3 = document.createElement("p");
    carDetails.append(p3);
    p3.innerHTML = 'Price: ' + car.price;
    p3.classList.add("pad-this");

    const p4 = document.createElement("p");
    carDetails.append(p4);
    p4.innerHTML = 'MPG: ' + car.mpg;
    p4.classList.add("pad-this");

    const ul = document.createElement("ul");
    carDetails.append(ul);
    ul.classList.add("pad-this");
    console.log(car.features);
    car.features.forEach((feature) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = feature;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit").innerHTML = "Edit Car Details";
        populateEditForm(car);
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteCar(car);
    }

    
};

const deleteCar = async(car) => {
    const form = document.getElementById("car-form");
    let response = await fetch(`/api/cars/${form._id.value}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "`application/json;charset=utf-8"
        }
    });

    if(response.status != 200){
        console.log("Error Deleting!");
        return;
    }

    let result = await response.json();
    showCars();
    document.getElementById("car-details").innerHTML = "";
    resetForm();
}

const populateEditForm = (car) => {
    const form = document.getElementById("car-form");
    form._id.value = car._id;
    form.name.value = car.name;
    form.engine.value = car.engine;
    form.horsepower.value = car.horsepower;
    form.price.value = car.price;
    form.mpg.value = car.mpg;

    populateFeature(car);
};

const populateFeature = (car) => {
    const section = document.getElementById("feature-boxes");
    
    car.features.forEach((feature) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = feature;
        section.append(input);
    })
};

const addEditCar = async(e) => {
    e.preventDefault();
    const form = document.getElementById("car-form");
    const formData = new FormData(form);
    const dataStatus = document.getElementById("data-status");
    let response;

    formData.append("features", getFeatures());

    if (form._id.value == -1) {
        formData.delete("_id");
        

        console.log(...formData);

        response = await fetch("/api/cars", {
            method: "POST",
            body: formData
        });
        dataStatus.classList.remove("hidden");
        dataStatus.innerHTML = "Data Successfully Posted!";
        setTimeout(() => {
            dataStatus.classList.add("hidden");
        }, 3000);
    } else {
        
        console.log(...formData);

        response = await fetch(`/api/cars/${form._id.value}`, {
            method: "PUT",
            body: formData
        });

        if(response.status != 200){
            console.log("Error Posting Data!");
        }

        car = await response.json();

        if(form._id.value != -1){
            displayDetails(car);
        }

        resetForm();
        document.querySelector(".dialog").classList.add("transparent");
        showCars();
    }

    if (response.status != 200) {
        dataStatus.classList.remove("hidden");
        dataStatus.innerHTML = "Error Posting Data!";
        setTimeout(() => {
            dataStatus.classList.add("hidden");
        }, 3000);
        console.log("Error posting data");
    }

    response = await response.json();
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showCars();
};

const getFeatures = () => {
    const inputs = document.querySelectorAll("#feature-boxes input");
    let features = [];

    inputs.forEach((input) => {
        features.push(input.value);
    });

    return features;
}

const resetForm = () => {
    const form = document.getElementById("car-form");
    form.reset();
    form._id = "-1";
    document.getElementById("feature-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit").innerHTML = "Add Car";
    resetForm();
};

const addFeature = (e) => {
    e.preventDefault();
    const section = document.getElementById("feature-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

window.onload = () => {
    showCars();
    document.getElementById("car-form").onsubmit = addEditCar;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-feature").onclick = addFeature;
};