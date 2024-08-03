import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import {useAuth} from '../context/AuthContext'
import {Link, useNavigate} from "react-router-dom"


export default function LogIn() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login} = useAuth()
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/expenses")
        } catch(error) {
            console.log(error)
            setError('Failed to sign in')
        }
        setLoading(false)
    }
    return (
        <>
            <Card style={{maxWidth:"400px", margin:"auto"}}> 
                <Card.Body>
                    <h2 className="text-center mb-4"> Log In </h2>
                    {error && <Alert variant = "danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label className="mb-2"> Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label className="mb-2"> Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>

                        <Button disabled={loading} className="w-100 mt-2" type="submit">Log In</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className = "w-100 text-center mt-2">
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    );
}