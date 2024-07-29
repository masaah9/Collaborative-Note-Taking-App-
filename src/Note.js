import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useNotes } from './NotesContext';

const Note = ({ setCurrentPage, setSelectedNoteId }) => {
    const { notes, addNote, deleteNote, editNote, revertNote } = useNotes();
    const [show, setShow] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addNote(newNote);
        setNewNote({ title: '', content: '' });
        handleClose();
    };

    return (
        <Container>
            <Row className="mt-5">
                <Col>
                    <Button variant="primary" onClick={handleShow}>
                        Add Note
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                {notes.map((note) => (
                    <Col md="4" key={note.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{note.title}</Card.Title>
                                <Card.Text>{note.content}</Card.Text>
                                <Button
                                    variant="warning"
                                    onClick={() => {
                                        setSelectedNoteId(note.id);
                                        setCurrentPage('history');
                                    }}
                                >
                                    Revert
                                </Button>
                                <Button variant="danger" onClick={() => deleteNote(note.id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                value={newNote.title}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formContent" className="mt-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter content"
                                name="content"
                                value={newNote.content}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Save Note
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Note;
