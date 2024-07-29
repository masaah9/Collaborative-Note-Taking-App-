import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure this path is correct

const VersionHistory = ({ noteId, revertNote, setCurrentPage }) => {
    const [versions, setVersions] = useState([]);

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const historyCollection = collection(db, 'notes', noteId, 'history');
                const q = query(historyCollection, orderBy('savedAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const versionsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setVersions(versionsList);
            } catch (error) {
                console.error("Error fetching version history:", error);
            }
        };
        fetchVersions();
    }, [noteId]);

    return (
        <div>
            <h2>Version History</h2>
            <ul>
                {versions.length === 0 ? (
                    <li>No version history available</li>
                ) : (
                    versions.map((version, index) => (
                        <li key={index}>
                            <p><strong>Content:</strong> {version.text}</p>
                            <p><strong>Category:</strong> {version.category}</p>
                            <p><strong>Saved At:</strong> {new Date(version.savedAt.toDate()).toLocaleString()}</p>
                            <Button variant="warning" onClick={() => revertNote(noteId, version)}>Revert</Button>
                        </li>
                    ))
                )}
            </ul>
            <Button variant="secondary" onClick={() => setCurrentPage('notes')}>Back</Button>
        </div>
    );
};

export default VersionHistory;
