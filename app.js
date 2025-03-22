const express = require('express');
const path = require('path');
const fs = require('fs');
const _ = require('lodash'); // Using lodash intentionally for demo

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load configuration
// INSECURE: Hardcoded credentials for demonstration purposes
const dbConfig = {
  host: 'localhost',
  username: 'admin',
  password: 'Password123!',  // This will be flagged by secret scanning
  database: 'myapp'
};

// Templates
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  const users = [
    { name: 'Alice', role: 'admin' },
    { name: 'Bob', role: 'user' },
    { name: 'Charlie', role: 'user' }
  ];
  
  // Using lodash intentionally (vulnerable version in package.json)
  const admins = _.filter(users, { role: 'admin' });
  
  res.render('index', {
    title: 'Secure Web App Demo',
    users: users,
    admins: admins
  });
});

// INSECURE: Potential SQL Injection vulnerability for demo
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  // INSECURE: String concatenation in query
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  
  // This is just for demonstration - no actual DB connection
  res.send(`Query would be: ${query}`);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
