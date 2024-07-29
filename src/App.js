import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import VersionHistory from './VersionHistory';
import Login from './Login';
import Register from './Register';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [currentPage, setCurrentPage] = useState('login');
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentPage('notes');
            } else {
                setCurrentPage('login');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (currentPage === 'notes') {
            const notesCollection = collection(db, 'notes');
            const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
                const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNotes(notesData);
            });

            return () => unsubscribe();
        }
    }, [currentPage]);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const register = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentPage('login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const addNote = async (note) => {
        try {
            const notesCollection = collection(db, 'notes');
            const docRef = await addDoc(notesCollection, {
                ...note,
                userId: auth.currentUser.uid,
                history: [],
            });
            setNotes([...notes, { id: docRef.id, ...note, history: [] }]);
        } catch (error) {
            console.error("Error adding note: ", error);
        }
    };

    const updateNote = async (id, updatedNote) => {
        try {
            const noteDoc = doc(db, 'notes', id);
            await updateDoc(noteDoc, updatedNote);
        } catch (error) {
            console.error("Error updating note: ", error);
        }
    };

    const deleteNote = async (id) => {
        try {
            const noteDoc = doc(db, 'notes', id);
            await deleteDoc(noteDoc);
        } catch (error) {
            console.error("Error deleting note: ", error);
        }
    };

    const revertNote = async (id, version) => {
        try {
            const note = notes.find((note) => note.id === id);
            const updatedHistory = note.history.filter(v => v !== version);
            const updatedNote = { ...note, content: version.content, history: updatedHistory };
            await updateNote(id, updatedNote);
        } catch (error) {
            console.error("Error reverting note: ", error);
        }
    };

    return (
        <Container>
            {currentPage === 'login' && (
                <Login login={login} setCurrentPage={setCurrentPage} authError={authError} />
            )}
            {currentPage === 'register' && (
                <Register register={register} setCurrentPage={setCurrentPage} authError={authError} />
            )}
            {currentPage === 'notes' && (
                <div>
                    <Button variant="danger" onClick={logout}>Logout</Button>
                    <NotesList
                        notes={notes}
                        setCurrentNote={setCurrentNote}
                        setCurrentPage={setCurrentPage}
                        addNote={addNote}
                        deleteNote={deleteNote}
                    />
                </div>
            )}
            {currentPage === 'editNote' && currentNote && (
                <NoteEditor
                    note={currentNote}
                    saveNote={updateNote}
                    setCurrentPage={setCurrentPage}
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
        </Container>
    );
};

export default App;
