import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure this path is correct

const NoteEditor = ({ note, setCurrentPage }) => {
    const [editedNote, setEditedNote] = useState(note);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedNote({
            ...editedNote,
            [name]: value,
        });
    };

    const handleSave = async () => {
        await editNote(editedNote.id, editedNote);
        setCurrentPage('notes');
    };

    const editNote = async (noteId, newNoteData) => {
        try {
            // Fetch the current note data
            const noteDocRef = doc(db, 'notes', noteId);
            const noteSnapshot = await getDoc(noteDocRef);
            const currentNoteData = noteSnapshot.data();

            // Save the current note data to the history collection
            const historyCollectionRef = collection(db, 'notes', noteId, 'history');
            await addDoc(historyCollectionRef, {
                ...currentNoteData,
                savedAt: serverTimestamp()
            });

            // Update the note with the new data
            await updateDoc(noteDocRef, newNoteData);

            console.log("Note edited successfully and history saved.");
        } catch (error) {
            console.error("Error editing note:", error);
        }
    };

    return (
        <div>
            <h2>Edit Note</h2>
            <form>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={editedNote.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                   <label>Content</label>
                    <textarea
                        name="content"
                        value={editedNote.content}
                        onChange={handleChange}
                    />
                </div>
            </form>
            <Button variant="primary" onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={() => setCurrentPage('notes')}>Back</Button>
        </div>
    );
};

export default NoteEditor;
