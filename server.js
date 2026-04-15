const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
let bookingsData = [];

function loadBookings() {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "data", "bookings.json"),
      "utf8",
    );
    bookingsData = JSON.parse(data);
  } catch (error) {
    bookingsData = [];
  }
}

function saveBookings() {
  fs.writeFileSync(
    path.join(__dirname, "data", "bookings.json"),
    JSON.stringify(bookingsData, null, 2),
  );
}

function loadMenu() {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "data", "menu.json"),
      "utf8",
    );
    return JSON.parse(data);
  } catch (error) {
    return { menu: [], categories: [] };
  }
}

const menuData = loadMenu();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /api/menu
  if (req.method === "GET" && url.pathname === "/api/menu") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, data: menuData }));
    return;
  }

  // GET /api/menu/categories
  if (req.method === "GET" && url.pathname === "/api/menu/categories") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, data: menuData.categories }));
    return;
  }

  // POST /api/bookings
  if (req.method === "POST" && url.pathname === "/api/bookings") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const booking = JSON.parse(body);
      const newBooking = {
        id: Date.now(),
        ...booking,
        createdAt: new Date().toISOString(),
        status: "confirmed",
      };
      bookingsData.push(newBooking);
      saveBookings();
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: newBooking }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: false, message: "Not found" }));
});

loadBookings();

server.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
  console.log("GET  /api/menu");
  console.log("GET  /api/menu/categories");
  console.log("POST /api/bookings");
});
