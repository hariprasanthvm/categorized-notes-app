import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { NativeBaseProvider, Box, VStack, HStack, Text, Heading, Button, Input, ScrollView, Pressable, Select, TextArea, Center } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NoteApp() {
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
    const loadData = async () => {
      try {
        const localSavedCategories = await AsyncStorage.getItem('app_categories');
        const localSavedNotes = await AsyncStorage.getItem('app_notes');

        if (localSavedCategories && localSavedNotes) {
          setCategories(JSON.parse(localSavedCategories));
          setNotes(JSON.parse(localSavedNotes));
        } else {
          const standardCats = [{ id: 'cat1', name: 'Work' }, { id: 'cat2', name: 'Personal' }];
          const standardNotes = [{ id: 'n1', title: 'To-Do List', content: 'Finish the React Native assignment.', categoryId: 'cat1' }];
          setCategories(standardCats);
          setNotes(standardNotes);
          await AsyncStorage.setItem('app_categories', JSON.stringify(standardCats));
          await AsyncStorage.setItem('app_notes', JSON.stringify(standardNotes));
        }
      } catch (error) {
        Alert.alert("Storage Error", "Failed to load local data.");
      }
    };
    loadData();
  }, []);

  const saveToDeviceMemory = async (updatedCats, updatedNotes) => {
    setCategories(updatedCats);
    setNotes(updatedNotes);
    await AsyncStorage.setItem('app_categories', JSON.stringify(updatedCats));
    await AsyncStorage.setItem('app_notes', JSON.stringify(updatedNotes));
  };

  const handleUserSignup = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter both email and password.');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Signup Failed');
      
      Alert.alert('Success', 'Account created successfully.');
      setCurrentScreen('LOGIN');
    } catch (error) {
      Alert.alert('Auth Error', error.message);
    }
  };

  const handleUserLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter both email and password.');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Invalid Credentials');
      
      const data = await response.json();
      await AsyncStorage.setItem('user_token', data.token);
      setCurrentScreen('HOME');
    } catch (error) {
      Alert.alert('Auth Error', error.message);
    }
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
      return Alert.alert('Error', 'Missing required fields.');
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
      <Center flex={1} bg="coolGray.100" px={4}>
        <Box bg="white" p={6} rounded="xl" shadow={2} w="100%" maxW="400px">
          <VStack space={4}>
            <Heading textAlign="center" color="primary.600">Note Taking App</Heading>
            <Text textAlign="center" color="coolGray.500">Sign in to access your notes</Text>
            <Input placeholder="Email Address" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button onPress={handleUserLogin} colorScheme="primary">Login</Button>
            <Button onPress={() => setCurrentScreen('SIGNUP')} variant="outline" colorScheme="primary">Create Account</Button>
          </VStack>
        </Box>
      </Center>
    );
  }

  if (currentScreen === 'SIGNUP') {
    return (
      <Center flex={1} bg="coolGray.100" px={4}>
        <Box bg="white" p={6} rounded="xl" shadow={2} w="100%" maxW="400px">
          <VStack space={4}>
            <Heading textAlign="center" color="primary.600">Register</Heading>
            <Text textAlign="center" color="coolGray.500">Create a new user account</Text>
            <Input placeholder="Email Address" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button onPress={handleUserSignup} colorScheme="primary">Save Account</Button>
            <Button onPress={() => setCurrentScreen('LOGIN')} variant="ghost" colorScheme="coolGray">Back to Login</Button>
          </VStack>
        </Box>
      </Center>
    );
  }

  if (currentScreen === 'HOME') {
    return (
      <Box flex={1} safeArea bg="coolGray.100" p={4}>
        <HStack justifyContent="space-between" alignItems="center" mb={6}>
          <Heading>Categories</Heading>
          <Button size="sm" variant="subtle" colorScheme="primary" onPress={() => setCurrentScreen('ADD_CATEGORY')}>+ Category</Button>
        </HStack>
        <ScrollView>
          <VStack space={3}>
            {categories.map(cat => (
              <Pressable key={cat.id} onPress={() => { setSelectedCategoryId(cat.id); setCurrentScreen('CATEGORY'); }}>
                <Box bg="white" p={4} rounded="lg" shadow={1} flexDirection="row" justifyContent="space-between">
                  <Text fontWeight="bold" fontSize="md" color="coolGray.800">{cat.name}</Text>
                  <Text color="primary.500" fontWeight="bold">➔</Text>
                </Box>
              </Pressable>
            ))}
            <Button mt={4} colorScheme="primary" onPress={() => { setNewNoteCatId(categories[0]?.id || ''); setCurrentScreen('ADD_NOTE'); }}>+ Create Note</Button>
          </VStack>
        </ScrollView>
      </Box>
    );
  }

  if (currentScreen === 'CATEGORY') {
    const targetedCat = categories.find(c => c.id === selectedCategoryId);
    const filteredNotes = notes.filter(n => n.categoryId === selectedCategoryId);
    return (
      <Box flex={1} safeArea bg="coolGray.100" p={4}>
        <VStack space={4} flex={1}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading>{targetedCat?.name}</Heading>
            <Button size="sm" variant="ghost" colorScheme="coolGray" onPress={() => setCurrentScreen('HOME')}>← Back</Button>
          </HStack>
          {filteredNotes.length === 0 ? (
            <Center mt={10}><Text color="coolGray.400">No notes in this category.</Text></Center>
          ) : (
            <ScrollView>
              <VStack space={3}>
                {filteredNotes.map(note => (
                  <Pressable key={note.id} onPress={() => { setSelectedNoteId(note.id); setCurrentScreen('NOTES'); }}>
                    <Box bg="white" p={4} rounded="lg" shadow={1}>
                      <Text fontWeight="bold" fontSize="md" color="coolGray.800">{note.title}</Text>
                    </Box>
                  </Pressable>
                ))}
              </VStack>
            </ScrollView>
          )}
        </VStack>
      </Box>
    );
  }

  if (currentScreen === 'NOTES') {
    const activeNote = notes.find(n => n.id === selectedNoteId);
    return (
      <Box flex={1} safeArea bg="coolGray.100" p={4}>
        <Box bg="white" p={6} rounded="xl" shadow={2}>
          <VStack space={4}>
            <Heading size="md">{activeNote?.title}</Heading>
            <Text color="coolGray.600" fontSize="md" lineHeight="lg">{activeNote?.content}</Text>
            <Button mt={4} onPress={() => setCurrentScreen('CATEGORY')} variant="outline" colorScheme="coolGray">Close Note</Button>
          </VStack>
        </Box>
      </Box>
    );
  }

  if (currentScreen === 'ADD_CATEGORY') {
    return (
      <Center flex={1} safeArea bg="coolGray.100" px={4}>
        <Box bg="white" p={6} rounded="xl" shadow={2} w="100%" maxW="400px">
          <VStack space={4}>
            <Heading>New Category</Heading>
            <Input placeholder="Category Name" value={newCategoryName} onChangeText={setNewCategoryName} />
            <Button onPress={executeCategoryInsertion} colorScheme="primary">Save Category</Button>
            <Button variant="ghost" colorScheme="coolGray" onPress={() => setCurrentScreen('HOME')}>Cancel</Button>
          </VStack>
        </Box>
      </Center>
    );
  }

  if (currentScreen === 'ADD_NOTE') {
    return (
      <Center flex={1} safeArea bg="coolGray.100" px={4}>
        <Box bg="white" p={6} rounded="xl" shadow={2} w="100%" maxW="400px">
          <VStack space={4}>
            <Heading>New Note</Heading>
            <Input placeholder="Note Title" value={newNoteTitle} onChangeText={setNewNoteTitle} />
            <TextArea placeholder="Start writing..." value={newNoteContent} onChangeText={setNewNoteContent} h={32} />
            <Select selectedValue={newNoteCatId} minWidth="200" placeholder="Choose Category" onValueChange={itemValue => setNewNoteCatId(itemValue)}>
              {categories.map(c => <Select.Item key={c.id} label={c.name} value={c.id} />)}
            </Select>
            <Button onPress={executeNoteInsertion} colorScheme="primary">Save Note</Button>
            <Button variant="ghost" colorScheme="coolGray" onPress={() => setCurrentScreen('HOME')}>Cancel</Button>
          </VStack>
        </Box>
      </Center>
    );
  }

  return null;
}

export default function App() {
  return (
    <NativeBaseProvider>
      <NoteApp />
    </NativeBaseProvider>
  );
}
