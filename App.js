import React, { useState, useEffect } from 'react';

const Box = ({ children, style, ...props }) => <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'white', ...style }} {...props}>{children}</div>;
const VStack = ({ children, style }) => <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...style }}>{children}</div>;
const HStack = ({ children, style }) => <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', ...style }}>{children}</div>;
const Text = ({ children, style }) => <span style={{ color: 'black', fontSize: '14px', ...style }}>{children}</span>;
const Heading = ({ children, style }) => <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: 'black', ...style }}>{children}</h2>;
const Button = ({ children, onPress, colorScheme = 'primary', style }) => (
  <button onClick={onPress} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: colorScheme === 'primary' ? 'blue' : 'green', color: 'white', fontWeight: 'bold', cursor: 'pointer', ...style }}>
    {children}
  </button>
);
const Input = ({ placeholder, value, onChangeText, secureTextEntry, style }) => (
  <input type={secureTextEntry ? 'password' : 'text'} placeholder={placeholder} value={value} onChange={(e) => onChangeText(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid gray', fontSize: '14px', ...style }} />
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
    const localSavedCategories = localStorage.getItem('device_categories');
    const localSavedNotes = localStorage.getItem('device_notes');

    if (localSavedCategories && localSavedNotes) {
      setCategories(JSON.parse(localSavedCategories));
      setNotes(JSON.parse(localSavedNotes));
    } else {
      const standardCats = [{ id: 'cat1', name: 'Work' }, { id: 'cat2', name: 'Personal' }];
      const standardNotes = [{ id: 'n1', title: 'Verify Pipeline', content: 'Ensure all folders are clean.', categoryId: 'cat1' }];
      setCategories(standardCats);
      setNotes(standardNotes);
      localStorage.setItem('device_categories', JSON.stringify(standardCats));
      localStorage.setItem('device_notes', JSON.stringify(standardNotes));
    }
  }, []);

  const saveToDeviceMemory = (updatedCats, updatedNotes) => {
    setCategories(updatedCats);
    setNotes(updatedNotes);
    localStorage.setItem('device_categories', JSON.stringify(updatedCats));
    localStorage.setItem('device_notes', JSON.stringify(updatedNotes));
  };

  const handleUserSignup = () => {
    if (!email || !password) return alert('Error');
    setCurrentScreen('LOGIN');
  };

  const handleUserLogin = () => {
    if (!email || !password) return alert('Error');
    setIsAuthenticated(true);
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
    if (!newNoteTitle.trim() || !newNoteContent.trim() || !newNoteCatId) return alert('Error');
    const updatedNotes = [...notes, { id: 'note_' + Date.now(), title: newNoteTitle, content: newNoteContent, categoryId: newNoteCatId }];
    saveToDeviceMemory(categories, updatedNotes);
    setNewNoteTitle('');
    setNewNoteContent('');
    setCurrentScreen('HOME');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: 'lightgray', minHeight: '100vh', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'gray', borderRadius: '16px', overflow: 'hidden', border: '4px solid black' }}>
        
        <div style={{ background: 'darkgray', padding: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' }}>
          <span>LTE Connection Engine</span>
          <span>9:41 AM</span>
        </div>

        {currentScreen === 'LOGIN' && (
          <Box style={{ margin: '15px' }}>
            <VStack>
              <Heading style={{ textAlign: 'center', marginBottom: '10px' }}>Sign In</Heading>
              <Input placeholder="Email" value={email} onChangeText={setEmail} />
              <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <Button onPress={handleUserLogin}>Login</Button>
              <Button colorScheme="secondary" onPress={() => setCurrentScreen('SIGNUP')}>Create Account</Button>
            </VStack>
          </Box>
        )}

        {currentScreen === 'SIGNUP' && (
          <Box style={{ margin: '15px' }}>
            <VStack>
              <Heading style={{ textAlign: 'center', marginBottom: '10px' }}>Register</Heading>
              <Input placeholder="Email" value={email} onChangeText={setEmail} />
              <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <Button onPress={handleUserSignup}>Save Account</Button>
              <Button colorScheme="secondary" onPress={() => setCurrentScreen('LOGIN')}>Back to Login</Button>
            </VStack>
          </Box>
        )}

        {currentScreen === 'HOME' && (
          <Box style={{ margin: '15px' }}>
            <VStack>
              <HStack style={{ justifyContent: 'space-between' }}>
                <Heading>Folders</Heading>
                <Button style={{ padding: '6px 10px', fontSize: '12px' }} colorScheme="secondary" onPress={() => setCurrentScreen('ADD_CATEGORY')}>+ Category</Button>
              </HStack>
              
              {categories.map(cat => (
                <div key={cat.id} onClick={() => { setSelectedCategoryId(cat.id); setCurrentScreen('CATEGORY'); }} style={{ padding: '14px', background: 'white', border: '1px solid gray', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>{cat.name}</Text>
                  <Text>➔</Text>
                </div>
              ))}
              <Button onPress={() => { setNewNoteCatId(categories[0]?.id || ''); setCurrentScreen('ADD_NOTE'); }}>+ Create Note</Button>
            </VStack>
          </Box>
        )}

        {currentScreen === 'CATEGORY' && (() => {
          const targetedCat = categories.find(c => c.id === selectedCategoryId);
          const filteredNotes = notes.filter(n => n.categoryId === selectedCategoryId);
          return (
            <Box style={{ margin: '15px' }}>
              <VStack>
                <Heading>{targetedCat?.name}</Heading>
                <Button style={{ alignSelf: 'flex-start', padding: '6px 12px' }} colorScheme="secondary" onPress={() => setCurrentScreen('HOME')}>Return Home</Button>
                
                {filteredNotes.length === 0 ? (
                  <Text style={{ textAlign: 'center', padding: '20px' }}>Empty folder.</Text>
                ) : (
                  filteredNotes.map(note => (
                    <div key={note.id} onClick={() => { setSelectedNoteId(note.id); setCurrentScreen('NOTES'); }} style={{ padding: '12px', background: 'lightgray', borderRadius: '6px', cursor: 'pointer' }}>
                      <Text style={{ fontWeight: 'bold', display: 'block' }}>{note.title}</Text>
                    </div>
                  ))
                )}
              </VStack>
            </Box>
          );
        })()}

        {currentScreen === 'NOTES' && (() => {
          const activeNote = notes.find(n => n.id === selectedNoteId);
          return (
            <Box style={{ margin: '15px' }}>
              <VStack>
                <Heading>{activeNote?.title}</Heading>
                <Text>{activeNote?.content}</Text>
                <Button onPress={() => setCurrentScreen('CATEGORY')}>Close View</Button>
              </VStack>
            </Box>
          );
        })()}

        {currentScreen === 'ADD_CATEGORY' && (
          <Box style={{ margin: '15px' }}>
            <VStack>
              <Heading>Add Category</Heading>
              <Input placeholder="Category Name" value={newCategoryName} onChangeText={setNewCategoryName} />
              <Button onPress={executeCategoryInsertion}>Commit Category</Button>
              <Button colorScheme="secondary" onPress={() => setCurrentScreen('HOME')}>Cancel</Button>
            </VStack>
          </Box>
        )}

        {currentScreen === 'ADD_NOTE' && (
          <Box style={{ margin: '15px' }}>
            <VStack>
              <Heading>Add Note</Heading>
              <Input placeholder="Title" value={newNoteTitle} onChangeText={setNewNoteTitle} />
              <textarea value={newNoteContent} onChange={(e) => setNewNoteContent(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid gray', height: '100px' }} />
              
              <select value={newNoteCatId} onChange={(e) => setNewNoteCatId(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid gray' }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <Button onPress={executeNoteInsertion}>Save Note</Button>
              <Button colorScheme="secondary" onPress={() => setCurrentScreen('HOME')}>Cancel</Button>
            </VStack>
          </Box>
        )}

      </div>
    </div>
  );
}
