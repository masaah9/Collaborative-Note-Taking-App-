// Login.js
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const Login = ({ login, setCurrentPage, authError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div>
            <h2>Login</h2>
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
                <Button variant="primary" type="submit">Login</Button>
                <Button variant="link" onClick={() => setCurrentPage('register')} className="ml-2">Register</Button>
                {authError && <p className="text-danger">{authError}</p>}
            </Form>
        </div>
    );
};

export default Login;
