import React, { useState, useEffect } from 'react';

const Box = ({ children, style, ...props }) => (
  <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', ...style }} {...props}>
    {children}
  </div>
);

const VStack = ({ children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', ...style }}>
    {children}
  </div>
);

const HStack = ({ children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', ...style }}>
    {children}
  </div>
);

const Text = ({ children, style }) => (
  <span style={{ color: '#4B5563', fontSize: '14px', fontFamily: 'system-ui', ...style }}>
    {children}
  </span>
);

const Heading = ({ children, style }) => (
  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px', fontFamily: 'system-ui', ...style }}>
    {children}
  </h2>
);

const Button = ({ children, onPress, colorScheme = 'primary', style }) => (
  <button 
    onClick={onPress} 
    style={{ 
      padding: '12px 16px', 
      borderRadius: '8px', 
      border: 'none', 
      background: colorScheme === 'primary' ? '#4F46E5' : '#F3F4F6', 
      color: colorScheme === 'primary' ? '#ffffff' : '#374151', 
      fontWeight: '600', 
      fontSize: '14px',
      cursor: 'pointer', 
      transition: 'background 0.2s',
      ...style 
    }}
  >
    {children}
  </button>
);

const Input = ({ placeholder, value, onChangeText, secureTextEntry, style }) => (
  <input 
    type={secureTextEntry ? 'password' : 'text'} 
    placeholder={placeholder} 
    value={value} 
    onChange={(e) => onChangeText(e.target.value)} 
    style={{ 
      padding: '12px', 
      borderRadius: '8px', 
      border: '1px solid #D1D5DB', 
      backgroundColor: '#F9FAFB',
      fontSize: '15px', 
      color: '#111827',
      outline: 'none',
      ...style 
    }} 
  />
);

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

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#F3F4F6', minHeight: '100vh', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#111827', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '8px solid #1F2937' }}>
        
        <div style={{ background: '#1F2937', padding: '12px 20px', color: '#9CA3AF', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
          <span>LTE Connection</span>
          <span>9:41 AM</span>
        </div>

        {currentScreen === 'LOGIN' && (
          <Box style={{ margin: '16px' }}>
            <VStack>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Heading style={{ marginBottom: '6px' }}>Welcome Back</Heading>
                <Text style={{ fontWeight: '600', color: '#4F46E5', display: 'block', fontSize: '15px' }}>Note Taking App</Text>
              </div>
              <Text style={{ textAlign: 'center', marginBottom: '8px', color: '#6B7280' }}>Sign in to access your secure deck</Text>
              
              <Input placeholder="Email Address" value={email} onChangeText={setEmail} />
              <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <Button onPress={handleUserLogin}>Login</Button>
              <Button colorScheme="secondary" onPress={() => setCurrentScreen('SIGNUP')}>Create Account</Button>
            </VStack>
          </Box>
        )}

        {currentScreen === 'SIGNUP' && (
          <Box style={{ margin: '16px' }}>
            <VStack>
              <Heading style={{ textAlign: 'center', marginBottom: '4px' }}>Register</Heading>
              <Text style={{ textAlign: 'center', marginBottom: '12px', color: '#6B7280' }}>Create a local sandbox storage file</Text>
              <Input placeholder="Email Address" value={email} onChangeText={setEmail} />
              <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <Button onPress={handleUserSignup}>Save Account</Button>
              <Button colorScheme="secondary" onPress={() => setCurrentScreen('LOGIN')}>Back to Login</Button>
            </VStack>
          </Box>
        )}

        {currentScreen === 'HOME' && (
          <Box style={{ margin: '16px' }}>
            <VStack>
              <HStack style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
                <Heading>Your Notes</Heading>
                <Button style={{ padding: '8px 12px', fontSize: '12px' }} colorScheme="secondary" onPress={() => setCurrentScreen('ADD_CATEGORY')}>+ Folder</Button>
              </HStack>
              
              {categories.map(cat => (
                <div key={cat.id} onClick={() => { setSelectedCategoryId(cat.id); setCurrentScreen('CATEGORY'); }} style={{ padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '700', color: '#1F2937' }}>{cat.name}</Text>
                  <Text style={{ color: '#4F46E5', fontWeight: 'bold' }}>➔</Text>
                </div>
              ))}
              <Button style={{ marginTop: '8px' }} onPress={() => { setNewNoteCatId(categories[0]?.id || ''); setCurrentScreen('ADD_NOTE'); }}>+ Create Note</Button>
            </VStack>
          </Box>
        )}

        {currentScreen === 'CATEGORY' && (() => {
          const targetedCat = categories.find(c => c.id === selectedCategoryId);
          const filteredNotes = notes.filter(n => n.categoryId === selectedCategoryId);
          return (
            <Box style={{ margin: '16px' }}>
              <VStack>
                <Heading>{targetedCat?.name}</Heading>
                <Button style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }} colorScheme="secondary" onPress={() => setCurrentScreen('HOME')}>← Back</Button>
                
                {filteredNotes.length === 0 ? (
                  <Text style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF' }}>No notes in this folder yet.</Text>
                ) : (
                  filteredNotes.map(note => (
                    <div key={note.id} onClick={() => { setSelectedNoteId(note.id); setCurrentScreen('NOTES'); }} style={{ padding: '14px 16px', background: '#F3F4F6', borderRadius: '8px', cursor: 'pointer' }}>
                      <Text style={{ fontWeight: '600', color: '#1F2937', display: 'block' }}>{note.title}</Text>
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
            <Box style={{ margin: '16px' }}>
              <VStack>
                <Heading>{activeNote?.title}</Heading>
                <div style={{ minHeight: '120px', lineHeight: '1.6' }}>
                  <Text>{activeNote?.content}</Text>
                </div>
                <Button onPress={() => setCurrentScreen('CATEGORY')}>Close Note</Button>
              </VStack>
            </Box>
          );
        })()}

        {currentScreen === 'ADD_CATEGORY' && (
          <Box style={{ margin: '16px' }}>
            <VStack>
              <Heading>New Folder</Heading>
              <Input placeholder="e.g. Invoices, Recipes" value={newCategoryName} onChangeText={setNewCategoryName} />
              <Button onPress={executeCategoryInsertion}>Create Folder</Button>
              <Button colorScheme="secondary" onPress={() => setCurrentScreen('HOME')}>Cancel</Button>
            </VStack>
          </Box>
        )}

        {currentScreen === 'ADD_NOTE' && (
          <Box style={{ margin: '16px' }}>
            <VStack>
              <Heading>New Note</Heading>
              <Input placeholder="Note Title" value={newNoteTitle} onChangeText={setNewNoteTitle} />
              <textarea 
                placeholder="Start writing..." 
                value={newNoteContent} 
                onChange={(e) => setNewNoteContent(e.target.value)} 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '15px', color: '#111827', outline: 'none', height: '120px', fontFamily: 'inherit', resize: 'none' }} 
              />
              
              <select 
                value={newNoteCatId} 
                onChange={(e) => setNewNoteCatId(e.target.value)} 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '15px', color: '#111827', outline: 'none' }}
              >
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
