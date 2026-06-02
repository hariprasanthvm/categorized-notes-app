import React, { useState, useEffect } from 'react';

// Web-safe components mimicking Native Base styling
const Center = ({ children }) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '16px' }}>{children}</div>;
const Card = ({ children }) => <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>{children}</div>;
const VStack = ({ children }) => <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>;
const Input = ({ placeholder, value, onChangeText, secureTextEntry }) => (
  <input type={secureTextEntry ? 'password' : 'text'} placeholder={placeholder} value={value} onChange={(e) => onChangeText(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', boxSizing: 'border-box', fontSize: '15px' }} />
);
const Button = ({ children, onPress, variant }) => (
  <button onClick={onPress} style={{ padding: '12px', borderRadius: '8px', backgroundColor: variant === 'ghost' ? 'transparent' : '#0ea5e9', color: variant === 'ghost' ? '#4b5563' : 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '15px' }}>{children}</button>
);
const Heading = ({ children }) => <h1 style={{ textAlign: 'center', color: '#0284c7', margin: 0, fontSize: '24px', fontFamily: 'sans-serif' }}>{children}</h1>;
const Text = ({ children, style }) => <p style={{ textAlign: 'center', color: '#6b7280', margin: 0, fontFamily: 'sans-serif', ...style }}>{children}</p>;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); 
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCatId, setNewNoteCatId] = useState('');

  useEffect(() => {
    const localSavedCategories = localStorage.getItem('app_categories');
    const localSavedNotes = localStorage.getItem('app_notes');

    if (localSavedCategories && localSavedNotes) {
      setCategories(JSON.parse(localSavedCategories));
      setNotes(JSON.parse(localSavedNotes));
    } else {
      const standardCats = [{ id: 'cat1', name: 'Work' }, { id: 'cat2', name: 'Personal' }];
      const standardNotes = [{ id: 'n1', title: 'To-Do List', content: 'Finish the React assignment.', categoryId: 'cat1' }];
      setCategories(standardCats);
      setNotes(standardNotes);
      localStorage.setItem('app_categories', JSON.stringify(standardCats));
      localStorage.setItem('app_notes', JSON.stringify(standardNotes));
    }
  }, []);

  const saveToDeviceMemory = (updatedCats, updatedNotes) => {
    setCategories(updatedCats);
    setNotes(updatedNotes);
    localStorage.setItem('app_categories', JSON.stringify(updatedCats));
    localStorage.setItem('app_notes', JSON.stringify(updatedNotes));
  };

  const handleUserSignup = () => {
    if (!email || !password) return alert('Please enter both email and password.');
    setCurrentScreen('LOGIN');
  };

  const handleUserLogin = () => {
    if (!email || !password) return alert('Please enter both email and password.');
    setCurrentScreen('HOME');
  };

  const executeCategoryInsertion = () => {
    if (!newCategoryName.trim()) return;
    const updatedCats = [...categories, { id: 'cat_' + Date.now(), name: newCategoryName }];
    saveToDeviceMemory(updatedCats, notes);
    setNewCategoryName('');
    setCurrentScreen('HOME');
  };

  const executeNoteInsertion = () => {
    const finalCatId = newNoteCatId || (categories[0] ? categories[0].id : '');
    if (!newNoteTitle.trim() || !newNoteContent.trim() || !finalCatId) {
      return alert('Missing required fields.');
    }
    const updatedNotes = [...notes, { id: 'note_' + Date.now(), title: newNoteTitle, content: newNoteContent, categoryId: finalCatId }];
    saveToDeviceMemory(categories, updatedNotes);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteCatId('');
    setCurrentScreen('HOME');
  };

  if (currentScreen === 'LOGIN') {
    return (
      <Center>
        <Card>
          <VStack>
            <Heading>Note Taking App</Heading>
            <Text>Sign in to access your notes</Text>
            <Input placeholder="Email Address" value={email} onChangeText={setEmail} />
            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button onPress={handleUserLogin}>Login</Button>
            <Button onPress={() => setCurrentScreen('SIGNUP')} variant="ghost">Create Account</Button>
          </VStack>
        </Card>
      </Center>
    );
  }

  if (currentScreen === 'SIGNUP') {
    return (
      <Center>
        <Card>
          <VStack>
            <Heading>Register</Heading>
            <Text>Create a new user account</Text>
            <Input placeholder="Email Address" value={email} onChangeText={setEmail} />
            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button onPress={handleUserSignup}>Save Account</Button>
            <Button onPress={() => setCurrentScreen('LOGIN')} variant="ghost">Back to Login</Button>
          </VStack>
        </Card>
      </Center>
    );
  }

  if (currentScreen === 'HOME') {
    return (
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ margin: 0, color: '#1f2937' }}>Categories</h1>
            <button onClick={() => setCurrentScreen('ADD_CATEGORY')} style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Category</button>
          </div>
          <VStack>
            {categories.map(cat => (
              <div key={cat.id} onClick={() => { setSelectedCategoryId(cat.id); setCurrentScreen('CATEGORY'); }} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                <strong style={{ color: '#1f2937' }}>{cat.name}</strong>
                <span style={{ color: '#0ea5e9', fontWeight: 'bold' }}>➔</span>
              </div>
            ))}
            <Button onPress={() => { setNewNoteCatId(categories[0]?.id || ''); setCurrentScreen('ADD_NOTE'); }}>+ Create Note</Button>
          </VStack>
        </div>
      </div>
    );
  }

  if (currentScreen === 'CATEGORY') {
    const targetedCat = categories.find(c => c.id === selectedCategoryId);
    const filteredNotes = notes.filter(n => n.categoryId === selectedCategoryId);
    return (
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ margin: 0, color: '#1f2937' }}>{targetedCat?.name}</h1>
            <button onClick={() => setCurrentScreen('HOME')} style={{ backgroundColor: 'transparent', color: '#6b7280', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>← Back</button>
          </div>
          {filteredNotes.length === 0 ? (
            <Text style={{ marginTop: '40px' }}>No notes in this category.</Text>
          ) : (
            <VStack>
              {filteredNotes.map(note => (
                <div key={note.id} onClick={() => { setSelectedNoteId(note.id); setCurrentScreen('NOTES'); }} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                  <strong style={{ color: '#1f2937' }}>{note.title}</strong>
                </div>
              ))}
            </VStack>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'NOTES') {
    const activeNote = notes.find(n => n.id === selectedNoteId);
    return (
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card style={{ maxWidth: '100%' }}>
            <VStack>
              <h2 style={{ margin: 0, color: '#1f2937' }}>{activeNote?.title}</h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{activeNote?.content}</p>
              <Button onPress={() => setCurrentScreen('CATEGORY')} variant="ghost">Close Note</Button>
            </VStack>
          </Card>
        </div>
      </div>
    );
  }

  if (currentScreen === 'ADD_CATEGORY') {
    return (
      <Center>
        <Card>
          <VStack>
            <Heading>New Category</Heading>
            <Input placeholder="Category Name" value={newCategoryName} onChangeText={setNewCategoryName} />
            <Button onPress={executeCategoryInsertion}>Save Category</Button>
            <Button onPress={() => setCurrentScreen('HOME')} variant="ghost">Cancel</Button>
          </VStack>
        </Card>
      </Center>
    );
  }

  if (currentScreen === 'ADD_NOTE') {
    return (
      <Center>
        <Card>
          <VStack>
            <Heading>New Note</Heading>
            <Input placeholder="Note Title" value={newNoteTitle} onChangeText={setNewNoteTitle} />
            <textarea placeholder="Start writing..." value={newNoteContent} onChange={(e) => setNewNoteContent(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', boxSizing: 'border-box', height: '100px', fontFamily: 'sans-serif' }} />
            <select value={newNoteCatId} onChange={(e) => setNewNoteCatId(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', boxSizing: 'border-box' }}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Button onPress={executeNoteInsertion}>Save Note</Button>
            <Button onPress={() => setCurrentScreen('HOME')} variant="ghost">Cancel</Button>
          </VStack>
        </Card>
      </Center>
    );
  }

  return null;
}
