import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// In-memory vehicle records for Part A.
const vehicles = [
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

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function sendHTML(res, statusCode, html) {
  res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

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
    vehicle.price !== undefined
  );
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  // A2: Routing
  if (req.method === "GET" && pathname === "/") {
    return sendHTML(res, 200, `
      <!DOCTYPE html>
      <html>
        <head><title>Vehicle Management</title></head>
        <body>
          <h1>Welcome to Vehicle Management Application</h1>
          <p>Node.js HTTP and FS Module Practical</p>
          <p>Visit <a href="/vehicles">/vehicles</a> to see all vehicles.</p>
          <p>Visit <a href="/about">/about</a> for application information.</p>
          <p>Visit <a href="/info">/info</a> for static information.</p>
        </body>
      </html>
    `);
  }

  if (req.method === "GET" && pathname === "/vehicles") {
    return sendJSON(res, 200, vehicles);
  }

  if (req.method === "GET" && pathname === "/about") {
    return sendHTML(res, 200, `
      <!DOCTYPE html>
      <html>
        <head><title>About</title></head>
        <body>
          <h1>About Vehicle Management</h1>
          <p>This application manages vehicle records using Node.js HTTP and FS modules.</p>
        </body>
      </html>
    `);
  }

  // A4: Serve public/info.html using the FS module.
  if (req.method === "GET" && pathname === "/info") {
    const infoPath = path.join(__dirname, "public", "info.html");

    return fs.readFile(infoPath, "utf8", (error, data) => {
      if (error) {
        return sendJSON(res, 500, { message: "Unable to read info.html" });
      }
      return sendHTML(res, 200, data);
    });
  }

  // A3: Add a vehicle using POST.
  if (req.method === "POST" && pathname === "/add-vehicle") {
    try {
      const newVehicle = await readRequestBody(req);

      if (!hasRequiredFields(newVehicle)) {
        return sendJSON(res, 400, {
          message: "Missing required fields: id, vehicleName, vehicleNumber, type and price"
        });
      }

      if (vehicles.some(vehicle => String(vehicle.id) === String(newVehicle.id))) {
        return sendJSON(res, 400, { message: "Vehicle ID already exists" });
      }

      vehicles.push(newVehicle);
      return sendJSON(res, 201, {
        message: "Vehicle added successfully",
        vehicle: newVehicle
      });
    } catch (error) {
      return sendJSON(res, 400, { message: error.message || "Invalid request" });
    }
  }

  // A5: Invalid route or unsupported method.
  return sendJSON(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
