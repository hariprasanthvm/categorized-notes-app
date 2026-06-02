import React, { useState, useEffect } from 'react';

const Box = ({ children, style, ...props }) => (
  <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)', ...style }} {...props}>
    {children}
  </div>
);

const VStack = ({ children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', ...style }}>
    {children}
  </div>
);

const HStack = ({ children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', ...style }}>
    {children}
  </div>
);

const Text = ({ children, style }) => (
  <span style={{ color: '#4B5563', fontSize: '15px', fontFamily: 'system-ui, sans-serif', lineHeight: '1.5', ...style }}>
    {children}
  </span>
);

const Heading = ({ children, style }) => (
  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px', fontFamily: 'system-ui, sans-serif', ...style }}>
    {children}
  </h2>
);

const Button = ({ children, onPress, colorScheme = 'primary', style }) => (
  <button 
    onClick={onPress} 
    style={{ 
      padding: '14px 24px', 
      borderRadius: '12px', 
      border: 'none', 
      background: colorScheme === 'primary' ? '#10B981' : '#F3F4F6', 
      color: colorScheme === 'primary' ? '#ffffff' : '#374151', 
      fontWeight: '700', 
      fontSize: '15px',
      cursor: 'pointer', 
      transition: 'all 0.2s ease',
      boxShadow: colorScheme === 'primary' ? '0 4px 6px -1px rgba(16, 185, 129, 0.2)' : 'none',
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
      padding: '14px 16px', 
      borderRadius: '12px', 
      border: '1px solid #E5E7EB', 
      backgroundColor: '#F9FAFB',
      fontSize: '15px', 
      color: '#111827',
      outline: 'none',
      transition: 'border-color 0.2s',
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
      const standardCats = [{ id: 'cat1', name: 'Main Course' }, { id: 'cat2', name: 'Desserts' }];
      const standardNotes = [{ id: 'n1', title: 'Signature Dish Recipe', content: 'Blend core spices evenly before simmering over medium flame.', categoryId: 'cat1' }];
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
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh', color: '#111827' }}>
      
      {/* Universal App Top Navigation Bar */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #F3F4F6', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => currentScreen !== 'LOGIN' && currentScreen !== 'SIGNUP' && setCurrentScreen('HOME')}>
          <span style={{ fontSize: '24px' }}>🍳</span>
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#10B981', letterSpacing: '-0.5px' }}>ChefDeck</span>
        </div>
        {currentScreen !== 'LOGIN' && currentScreen !== 'SIGNUP' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button colorScheme="secondary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }} onPress={() => setCurrentScreen('LOGIN')}>Sign Out</Button>
          </div>
        )}
      </header>

      {/* Main Content Layout Engine */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {currentScreen === 'LOGIN' && (
          <div style={{ maxWidth: '440px', margin: '40px auto' }}>
            <Box>
              <VStack>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <Heading style={{ marginBottom: '8px' }}>Welcome Chef</Heading>
                  <Text style={{ fontWeight: '600', color: '#10B981', display: 'block', fontSize: '16px' }}>Kitchen Management Portal</Text>
                </div>
                <Text style={{ textAlign: 'center', marginBottom: '8px', color: '#6B7280' }}>Sign in to manage recipes, menu items, and kitchen logs.</Text>
                
                <Input placeholder="Email Address" value={email} onChangeText={setEmail} />
                <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <Button onPress={handleUserLogin}>Login to Kitchen</Button>
                <Button colorScheme="secondary" onPress={() => setCurrentScreen('SIGNUP')}>Create Manager Account</Button>
              </VStack>
            </Box>
          </div>
        )}

        {currentScreen === 'SIGNUP' && (
          <div style={{ maxWidth: '440px', margin: '40px auto' }}>
            <Box>
              <VStack>
                <Heading style={{ textAlign: 'center', marginBottom: '4px' }}>Register Station</Heading>
                <Text style={{ textAlign: 'center', marginBottom: '12px', color: '#6B7280' }}>Setup an isolated local kitchen database file.</Text>
                <Input placeholder="Email Address" value={email} onChangeText={setEmail} />
                <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <Button onPress={handleUserSignup}>Save Account</Button>
                <Button colorScheme="secondary" onPress={() => setCurrentScreen('LOGIN')}>Back to Login</Button>
              </VStack>
            </Box>
          </div>
        )}

        {currentScreen === 'HOME' && (
          <VStack style={{ gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <Heading>Your Notes</Heading>
                <Text style={{ color: '#6B7280' }}>Manage menu clusters and culinary specifications.</Text>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button colorScheme="secondary" onPress={() => setCurrentScreen('ADD_CATEGORY')}>+ New Category</Button>
                <Button onPress={() => { setNewNoteCatId(categories[0]?.id || ''); setCurrentScreen('ADD_NOTE'); }}>+ Add Item Note</Button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {categories.map(cat => {
                const count = notes.filter(n => n.categoryId === cat.id).length;
                return (
                  <div 
                    key={cat.id} 
                    onClick={() => { setSelectedCategoryId(cat.id); setCurrentScreen('CATEGORY'); }} 
                    style={{ padding: '24px', backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <Text style={{ fontWeight: '700', color: '#1F2937', fontSize: '18px' }}>{cat.name}</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                      <span style={{ backgroundColor: '#E6F4EA', color: '#137333', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>
                        {count} {count === 1 ? 'item' : 'items'}
                      </span>
                      <Text style={{ color: '#10B981', fontWeight: 'bold' }}>View ➔</Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </VStack>
        )}

        {currentScreen === 'CATEGORY' && (() => {
          const targetedCat = categories.find(c => c.id === selectedCategoryId);
          const filteredNotes = notes.filter(n => n.categoryId === selectedCategoryId);
          return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Box>
                <VStack style={{ gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
                    <Heading>{targetedCat?.name}</Heading>
                    <Button colorScheme="secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onPress={() => setCurrentScreen('HOME')}>← Back to Overview</Button>
                  </div>
                  
                  {filteredNotes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                      <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🍽️</span>
                      <Text style={{ color: '#9CA3AF' }}>No culinary logs saved in this category yet.</Text>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {filteredNotes.map(note => (
                        <div 
                          key={note.id} 
                          onClick={() => { setSelectedNoteId(note.id); setCurrentScreen('NOTES'); }} 
                          style={{ padding: '16px 20px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#F9FAFB'}
                        >
                          <Text style={{ fontWeight: '600', color: '#1F2937' }}>{note.title}</Text>
                          <Text style={{ color: '#9CA3AF' }}>Read entry ➔</Text>
                        </div>
                      ))}
                    </div>
                  )}
                </VStack>
              </Box>
            </div>
          );
        })()}

        {currentScreen === 'NOTES' && (() => {
          const activeNote = notes.find(n => n.id === selectedNoteId);
          return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Box>
                <VStack style={{ gap: '24px' }}>
                  <Heading style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>{activeNote?.title}</Heading>
                  <div style={{ minHeight: '160px', padding: '8px 0' }}>
                    <p style={{ margin: 0, color: '#4B5563', fontSize: '16px', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontFamily: 'system-ui, sans-serif' }}>
                      {activeNote?.content}
                    </p>
                  </div>
                  <Button style={{ alignSelf: 'flex-start' }} onPress={() => setCurrentScreen('CATEGORY')}>Close Details</Button>
                </VStack>
              </Box>
            </div>
          );
        })()}

        {currentScreen === 'ADD_CATEGORY' && (
          <div style={{ maxWidth: '540px', margin: '0 auto' }}>
            <Box>
              <VStack>
                <Heading>Create Category Cluster</Heading>
                <Text style={{ color: '#6B7280', marginTop: '-8px', marginBottom: '4px' }}>Group your kitchen logs (e.g., Appetizers, Beverages, Invoices).</Text>
                <Input placeholder="Category Cluster Name" value={newCategoryName} onChangeText={setNewCategoryName} />
                <Button onPress={executeCategoryInsertion}>Commit Category</Button>
                <Button colorScheme="secondary" onPress={() => setCurrentScreen('HOME')}>Cancel</Button>
              </VStack>
            </Box>
          </div>
        )}

        {currentScreen === 'ADD_NOTE' && (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <Box>
              <VStack>
                <Heading>Log New Specification Entry</Heading>
                <Input placeholder="Entry Title (e.g., Spicy Tacos Spec sheet)" value={newNoteTitle} onChangeText={setNewNoteTitle} />
                
                <textarea 
                  placeholder="Type down ingredient measurements, workflow, prep details..." 
                  value={newNoteContent} 
                  onChange={(e) => setNewNoteContent(e.target.value)} 
                  style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px', color: '#111827', outline: 'none', height: '160px', fontFamily: 'inherit', resize: 'none', lineHeight: '1.5' }} 
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#4B5563' }}>Select Destined Category Portfolio:</label>
                  <select 
                    value={newNoteCatId} 
                    onChange={(e) => setNewNoteCatId(e.target.value)} 
                    style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px', color: '#111827', outline: 'none', cursor: 'pointer' }}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <Button onPress={executeNoteInsertion}>Save Specification Sheet</Button>
                <Button colorScheme="secondary" onPress={() => setCurrentScreen('HOME')}>Cancel</Button>
              </VStack>
            </Box>
          </div>
        )}

      </main>
    </div>
  );
}
