const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Log vehicle entry
