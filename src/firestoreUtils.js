import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Adjust this path if necessary

// Function to fetch a note from Firestore
export const getNote = async (noteId) => {
    try {
        const noteRef = doc(db, 'notes', noteId);
        const noteDoc = await getDoc(noteRef);

        if (noteDoc.exists()) {
            return noteDoc.data();
        } else {
            console.error('Note does not exist');
            return null;
        }
    } catch (error) {
        console.error('Error fetching note:', error);
        return null;
    }
};

// Function to update a note in Firestore
export const updateNote = async (noteId, updatedData) => {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, updatedData);
};

// Function to add a new note to Firestore
export const addNote = async (note) => {
    try {
        const notesCollection = collection(db, 'notes');
        const docRef = await addDoc(notesCollection, { ...note, history: [] });
        return docRef.id;
    } catch (error) {
        console.error('Error adding note:', error);
    }
};

// Function to add a new note version to Firestore
export const addNoteVersion = async (noteId, version) => {
    try {
        const noteRef = doc(db, 'notes', noteId);
        const noteDoc = await getDoc(noteRef);
        const note = noteDoc.data();

        if (note) {
            await updateDoc(noteRef, {
                history: [...note.history, { ...version, timestamp: new Date() }]
            });
        }
    } catch (error) {
        console.error('Error adding note version:', error);
    }
};


