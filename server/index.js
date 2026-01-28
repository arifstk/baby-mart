// const express = require('express')
import express from "express";
import dotenv from "dotenv";

// load env Server
dotenv.config();
// console.log(process.env);

const app = express()
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello from Baby mart!!')
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
  console.log(`Admin URL: ${process.env.ADMIN_URL}`);
  console.log(`API docs available at: http://localhost:${PORT}/api/docs`);
})




