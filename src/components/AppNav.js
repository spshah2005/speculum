import React from "react"

//bootstrap
import {Nav, Navbar, Container, Form, FormControl, Button, InputGroup} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

//images
import logo from "../images/logo.png"
import closet from "../images/my_closet_icon.png"

//authentication
import { useAuth } from "../context/AuthContext";

//css
import '../styles/appnav.css'

export default function AppNav() {
    const { currentUser, logout} = useAuth()
   
    return (
        <Navbar bg="black" expand="lg">
            <Container >
                <Navbar.Brand href="/">
                    <img
                        src={logo}
                        alt="Brand Logo"
                        className = "navbar-logo"
                    />
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto d-flex align-items-center">
                    <Nav.Link href="/my-wardrobe" className="nav-text">
                        <img
                            src={closet}
                            alt="Closet Icon"
                            className = "closet-icon"
                        />
                    </Nav.Link>

                    <Form className="d-flex">
                        <InputGroup className="custom-search-input">
                        <FormControl
                            type="search"
                            placeholder="mirror, mirror on the wall..."
                            aria-label="Search"
                        />
                        <Button className="btn-outline-white">
                            <FontAwesomeIcon icon={faSearch} />
                        </Button>
                        </InputGroup>
                    </Form>

                    {!currentUser && <Nav.Link href="/log-in" className="nav-text"> Sign In </Nav.Link>}
                    {currentUser && <Nav.Link href="/" className="nav-text" onClick={logout}> Log Out </Nav.Link>}

                </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}