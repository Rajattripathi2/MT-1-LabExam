import express from "express";

const app = express();
const PORT = 4000;

// B1: Middleware to parse JSON request bodies.
app.use(express.json());

// In-memory vehicle records for Part B.
let vehicles = [
  {
    id: 1,
    vehicleName: "Hyundai Creta",
    vehicleNumber: "HR26AB1234",
    type: "SUV",
    price: 1500000
  },
  {
    id: 2,
    vehicleName: "Maruti Swift",
    vehicleNumber: "DL8CAF5030",
    type: "Hatchback",
    price: 750000
  },
  {
    id: 3,
    vehicleName: "Honda City",
    vehicleNumber: "UP16CD4567",
    type: "Sedan",
    price: 1200000
  }
];

function hasRequiredFields(vehicle) {
  return (
    vehicle &&
    vehicle.id !== undefined &&
    typeof vehicle.vehicleName === "string" &&
    vehicle.vehicleName.trim() !== "" &&
    typeof vehicle.vehicleNumber === "string" &&
    vehicle.vehicleNumber.trim() !== "" &&
    typeof vehicle.type === "string" &&
    vehicle.type.trim() !== "" &&
    typeof vehicle.price === "number" &&
    Number.isFinite(vehicle.price) &&
    vehicle.price > 0
  );
}

function hasUpdateFields(vehicle) {
  return (
    vehicle &&
    typeof vehicle.vehicleName === "string" &&
    vehicle.vehicleName.trim() !== "" &&
    typeof vehicle.vehicleNumber === "string" &&
    vehicle.vehicleNumber.trim() !== "" &&
    typeof vehicle.type === "string" &&
    vehicle.type.trim() !== "" &&
    typeof vehicle.price === "number" &&
    Number.isFinite(vehicle.price) &&
    vehicle.price > 0
  );
}

// Handle malformed JSON sent by the client.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON" });
  }
  next(error);
});

// B2: GET all vehicles.
app.get("/vehicles", (req, res) => {
  res.status(200).json(vehicles);
});

// B2: GET a vehicle by ID.
app.get("/vehicles/:id", (req, res) => {
  const vehicle = vehicles.find(item => String(item.id) === req.params.id);

  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  res.status(200).json(vehicle);
});

// B2: POST a new vehicle.
app.post("/vehicles", (req, res) => {
  const newVehicle = req.body;

  if (!hasRequiredFields(newVehicle)) {
    return res.status(400).json({
      message: "Provide id, vehicleName, vehicleNumber, type and a positive numeric price"
    });
  }

  if (vehicles.some(item => String(item.id) === String(newVehicle.id))) {
    return res.status(400).json({ message: "Vehicle ID already exists" });
  }

  vehicles.push(newVehicle);
  res.status(201).json({
    message: "Vehicle added successfully",
    vehicle: newVehicle
  });
});

// B2: PUT to update a vehicle.
app.put("/vehicles/:id", (req, res) => {
  const index = vehicles.findIndex(item => String(item.id) === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  if (!hasUpdateFields(req.body)) {
    return res.status(400).json({
      message: "Provide vehicleName, vehicleNumber, type and a positive numeric price"
    });
  }

  vehicles[index] = {
    ...vehicles[index],
    vehicleName: req.body.vehicleName,
    vehicleNumber: req.body.vehicleNumber,
    type: req.body.type,
    price: req.body.price
  };

  res.status(200).json({
    message: "Vehicle updated successfully",
    vehicle: vehicles[index]
  });
});

// B2: DELETE a vehicle.
app.delete("/vehicles/:id", (req, res) => {
  const index = vehicles.findIndex(item => String(item.id) === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  const deletedVehicle = vehicles.splice(index, 1)[0];

  res.status(200).json({
    message: "Vehicle deleted successfully",
    vehicle: deletedVehicle
  });
});

// Invalid routes.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
