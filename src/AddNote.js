import React, { useState } from 'react';
import { useNotes } from './NotesContext';

const AddNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { addNote } = useNotes();

    const handleSubmit = (e) => {
        e.preventDefault();
        addNote({
            title,
            content,
            createdAt: new Date()
        });
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                required
            />
            <button type="submit">Add Note</button>
        </form>
    );
};

export default AddNote;
