import React from 'react';
import Note from './Note'; // Ensure Note.js is in the same directory
import NotesList from './NotesList'; // Ensure NotesList.js is in the same directory

const Layout = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Collaborative Note-Taking App</h1>
            </header>
            <main style={styles.main}>
                <Note />
                <NotesList />
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    header: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px',
        textAlign: 'center',
    },
    main: {
        flex: 1,
        padding: '20px',
    },
};

export default Layout;
