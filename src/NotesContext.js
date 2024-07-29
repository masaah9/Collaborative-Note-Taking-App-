import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, arrayUnion } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const NotesContext = createContext();

export const useNotes = () => {
    return useContext(NotesContext);
};

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user) {
            const fetchNotes = async () => {
                const notesCollection = collection(db, 'notes');
                const notesSnapshot = await getDocs(notesCollection);
                const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNotes(notesList);
            };

            fetchNotes();
        }
    }, [user]);

    const addNote = async (note) => {
        const notesCollection = collection(db, 'notes');
        const docRef = await addDoc(notesCollection, { ...note, userId: user.uid, history: [] });
        setNotes([...notes, { id: docRef.id, ...note, history: [] }]);
    };

    const editNote = async (id, updatedNote) => {
        const noteDoc = doc(db, 'notes', id);
        const note = notes.find(note => note.id === id);
        await updateDoc(noteDoc, {
            ...updatedNote,
            history: arrayUnion({ ...note, updatedAt: new Date() })
        });
        setNotes(notes.map(note => (note.id === id ? { id, ...updatedNote, history: [...note.history, { ...note, updatedAt: new Date() }] } : note)));
    };


    const deleteNote = async (id) => {
        const noteDoc = doc(db, 'notes', id);
        await deleteDoc(noteDoc);
        setNotes(notes.filter(note => note.id !== id));
    };

    const revertNote = async (id, version) => {
        const noteDoc = doc(db, 'notes', id);
        await updateDoc(noteDoc, { ...version, updatedAt: new Date() });
        setNotes(notes.map(note => (note.id === id ? { id, ...version, updatedAt: new Date() } : note)));
    };

    return (
        <NotesContext.Provider value={{ notes, addNote, editNote, deleteNote, revertNote, user }}>
            {children}
        </NotesContext.Provider>
    );
};
