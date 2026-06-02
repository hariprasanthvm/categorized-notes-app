const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const usersDatabase = [];

app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const existingUser = usersDatabase.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { id: 'usr_' + Date.now(), email, password };
  usersDatabase.push(newUser);
  
  res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = usersDatabase.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const mockJwtToken = 'ey-mock-token-' + user.id + '-' + Date.now();
  
  res.json({ 
    message: 'Login successful', 
    token: mockJwtToken, 
    email: user.email 
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log('Authentication backend running on http://localhost:' + PORT);
});
