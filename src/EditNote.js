// src/components/EditNote.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/EditNote.css';

const EditNote = () => {
    const { id } = useParams();
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const docRef = doc(firestore, 'notes', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNote(docSnap.data().text);
                    setCategory(docSnap.data().category);
                } else {
                    toast.error('Note not found');
                    navigate('/notes');
                }
            } catch (error) {
                toast.error('Error fetching note: ' + error.message);
            }
        };

        fetchNote();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(firestore, 'notes', id);
            const noteSnapshot = await getDoc(docRef);

            // Save the current version to history collection
            if (noteSnapshot.exists()) {
                const noteData = noteSnapshot.data();
                await addDoc(collection(firestore, 'notes', id, 'history'), {
                    ...noteData,
                    savedAt: serverTimestamp()
                });
            }

            // Update the note
            await updateDoc(docRef, { text: note, category: category, savedAt: serverTimestamp() });
            toast.success('Note updated successfully');
            navigate('/notes');
        } catch (error) {
            toast.error('Error updating note: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-5 edit-note-form">
            <h2 className="mb-4">Edit Note</h2>
            <div className="form-group mb-3">
        <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
        />
            </div>
            <div className="form-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Update Note</button>
        </form>
    );
};

export default EditNote;
