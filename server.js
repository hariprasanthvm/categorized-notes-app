const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const globalUsersDatabase = [];
const globalCategoriesDatabase = [
  { id: 'cat1', name: 'Work' },
  { id: 'cat2', name: 'Personal' }
];
const globalNotesDatabase = [
  { id: 'n1', title: 'Verify Architecture', content: 'Ensure all modules are separated cleanly.', categoryId: 'cat1' }
];

app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  
  const userExists = globalUsersDatabase.find(u => u.email === email);
  if (userExists) return res.status(400).json({ error: 'Account already exists' });

  const newUser = { id: 'usr_' + Date.now(), email, password };
  globalUsersDatabase.push(newUser);
  res.status(201).json({ message: 'Success', userId: newUser.id });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = globalUsersDatabase.find(u => u.email === email && u.password === password);
  
  if (!user) return res.status(401).json({ error: 'Invalid identification parameters' });
  res.json({ message: 'Verified', token: 'mock-jwt-token-' + user.id, email });
});

app.get('/api/categories', (req, res) => res.json(globalCategoriesDatabase));

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  
  const newCat = { id: 'cat_' + Date.now(), name };
  globalCategoriesDatabase.push(newCat);
  res.status(201).json(newCat);
});

app.get('/api/notes', (req, res) => res.json(globalNotesDatabase));

app.post('/api/notes', (req, res) => {
  const { title, content, categoryId } = req.body;
  if (!title || !content || !categoryId) {
    return res.status(400).json({ error: 'Title, content, and categoryId are required' });
  }

  const newNote = { id: 'note_' + Date.now(), title, content, categoryId };
  globalNotesDatabase.push(newNote);
  res.status(201).json(newNote);
});

const PORT = 8080;
app.listen(PORT, () => console.log('Listening on port ' + PORT));
