// Register.js
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const Register = ({ register, setCurrentPage, authError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        register(email, password);
    };

    return (
        <div>
            <h2>Register</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Register</Button>
                <Button variant="link" onClick={() => setCurrentPage('login')} className="ml-2">Login</Button>
                {authError && <p className="text-danger">{authError}</p>}
            </Form>
        </div>
    );
};

export default Register;
