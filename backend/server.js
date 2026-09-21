const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, "data.json");

app.use(cors());
app.use(express.json());

// GET semua anggota
app.get("/api/members", (req, res) => {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  const members = JSON.parse(data);

  res.json(members);
});

// LOGIN LEADER
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "leader" && password === "123456") {
    return res.json({
      success: true,
      message: "Masuk paaakk mantapp👍🥰",
    });
  }

  res.status(401).json({
    success: false,
    message: "Username atau password salah paakk!🤣",
  });
});

// UPDATE nama dan NRP anggota
app.put("/api/members/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, nrp } = req.body;

  const data = fs.readFileSync(DATA_FILE, "utf-8");
  const members = JSON.parse(data);

  const member = members.members.find((member) => member.id === id);

  if (!member) {
    return res.status(404).json({
      message: "Member tidak ditemukan",
    });
  }

  member.name = name;
  member.nrp = nrp;

  fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2));

  res.json({
    message: "Data member berhasil diubah",
    member,
  });
});

// Halaman utama API
app.get("/", (req, res) => {
  res.json({
    message: "Shift Schedule API is running!",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
