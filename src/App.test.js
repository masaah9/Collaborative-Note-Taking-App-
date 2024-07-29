
// App.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import VersionHistory from './VersionHistory';
import Login from './Login';
import Register from './Register';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); // login, register, notes, versionHistory

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        setCurrentPage('notes');
      } else {
        setCurrentPage('login');
      }
    });

    const notesCollection = collection(db, 'notes');
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setNotes(notesData);
    });

    return unsubscribe;
  }, []);

  const addNote = async (note) => {
    const notesCollection = collection(db, 'notes');
    const docRef = await addDoc(notesCollection, { ...note, userId: currentUser.uid, history: [] });
    setNotes([...notes, { id: docRef.id, ...note, history: [] }]);
  };

  const editNote = async (id, updatedNote) => {
    const noteRef = doc(db, 'notes', id);
    const note = notes.find((note) => note.id === id);
    const newHistory = [{ content: note.content, timestamp: new Date() }, ...note.history];
    await updateDoc(noteRef, { ...updatedNote, history: newHistory });
    setNotes(notes.map((note) => (note.id === id ? { ...note, ...updatedNote, history: newHistory } : note)));
  };

  const deleteNote = async (id) => {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
    setNotes(notes.filter((note) => note.id !== id));
  };

  const revertNote = async (id, version) => {
    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, { content: version.content });
    setNotes(notes.map((note) => (note.id === id ? { ...note, content: version.content } : note)));
  };

  return (
      <div className="app">
        {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === 'register' && <Register setCurrentPage={setCurrentPage} />}
        {currentPage === 'notes' && (
            <NotesList
                notes={notes}
                setCurrentNote={setCurrentNote}
                setCurrentPage={setCurrentPage}
                addNote={addNote}
                deleteNote={deleteNote}
            />
        )}
        {currentPage === 'versionHistory' && currentNote && (
            <VersionHistory
                noteId={currentNote.id}
                notes={notes}
                revertNote={revertNote}
                setCurrentPage={setCurrentPage}
            />
        )}
        {currentPage === 'editNote' && currentNote && (
            <NoteEditor note={currentNote} saveNote={editNote} setCurrentPage={setCurrentPage} />
        )}
      </div>
  );
};

export default App;
