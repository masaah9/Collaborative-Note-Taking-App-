// NotesList.js
import React, { useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';

const NotesList = ({ notes, setCurrentNote, setCurrentPage, addNote, deleteNote }) => {
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (newNote.trim()) {
            addNote({ content: newNote });
            setNewNote('');
        }
    };

    return (
        <div>
            <h2>Notes</h2>
            <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="New note"
            />
            <Button onClick={handleAddNote}>Add Note</Button>
            <ListGroup>
                {notes.map((note) => (
                    <ListGroup.Item key={note.id}>
                        {note.content}
                        <Button variant="warning" onClick={() => { setCurrentNote(note); setCurrentPage('editNote'); }} className="ml-2">Edit</Button>
                        <Button variant="danger" onClick={() => deleteNote(note.id)} className="ml-2">Delete</Button>
                        <Button variant="info" onClick={() => { setCurrentNote(note); setCurrentPage('versionHistory'); }} className="ml-2">History</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default NotesList;
