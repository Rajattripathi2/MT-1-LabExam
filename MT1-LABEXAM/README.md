# MT1-LABEXAM – Vehicle Management Web Application

## Technologies
- Node.js
- Built-in HTTP module
- Built-in FS module
- Express.js
- JavaScript ES6
- Postman
- Git and GitHub

No database is used. Vehicle records are stored in JavaScript arrays.

## Project structure
```text
MT1-LABEXAM/
├── package.json
├── httpServer.js
├── expressApp.js
├── public/
│   └── info.html
└── screenshots/
```

## Setup
Open the project folder in VS Code and run:

```bash
npm install
```

## Part A – HTTP and FS server
Start the first terminal:

```bash
node httpServer.js
```

Server runs at `http://localhost:3000`.

Routes:
- `GET /` – Welcome page
- `GET /vehicles` – All vehicle records in JSON
- `GET /about` – Application information
- `GET /info` – Reads `public/info.html` using `fs.readFile()`
- `POST /add-vehicle` – Adds a vehicle using JSON

Example POST body:
```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "DL8CAF5030",
  "type": "Hatchback",
  "price": 750000
}
```

## Part B – Express REST API
Open a second terminal:

```bash
node expressApp.js
```

Server runs at `http://localhost:4000`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/vehicles` | Get all vehicles |
| GET | `/vehicles/1` | Get vehicle with ID 1 |
| POST | `/vehicles` | Add a vehicle |
| PUT | `/vehicles/1` | Update vehicle with ID 1 |
| DELETE | `/vehicles/1` | Delete vehicle with ID 1 |

### Postman request bodies

POST `http://localhost:4000/vehicles`:
```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "DL8CAF5030",
  "type": "Hatchback",
  "price": 750000
}
```

PUT `http://localhost:4000/vehicles/1`:
```json
{
  "vehicleName": "Hyundai Creta Updated",
  "vehicleNumber": "HR26AB1234",
  "type": "SUV",
  "price": 1600000
}
```

For POST and PUT in Postman, select **Body → raw → JSON**.

## GitHub submission
Run these commands from the project folder:

```bash
git init
git add .
git commit -m "Initial project setup"

git add httpServer.js public/info.html
git commit -m "Implement HTTP server and static file serving"

git add expressApp.js
git commit -m "Implement vehicle CRUD REST APIs"

git add README.md
git commit -m "Add project documentation"

git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```