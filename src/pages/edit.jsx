import React, { useState, useRef } from "react";
import { firestore } from "../firebase";
import { collection } from "@firebase/firestore"
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import "./style/edit.css"

export default function Edit() {
    const ref = collection(firestore, "users"); 

    const [username, setUserName] = useState("");
    const usernameRef = useRef();
    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const numberRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [number, setNumber] = useState("");
    const [status, setStatus] = useState("");
    const [firstname, setFirstName] = useState("");

    // States to manage visibility of passwords
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleSignOut = () => {
        localStorage.removeItem('email'); // Remove email from localStorage
        localStorage.removeItem('firstname'); // Remove firstname if stored
        window.location.href = '/login'; // Redirect to login page
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNumberChange = (e) => {
        let input = e.target.value;
        input = input.replace(/\D/g, "");

        // Add spaces automatically as user types
        if (input.length > 3 && input.length <= 6) {
            input = input.slice(0, 3) + " " + input.slice(3);
        } else if (input.length > 6) {
            input = input.slice(0, 3) + " " + input.slice(3, 6) + " " + input.slice(6, 10);
        }

        setNumber(input);
    };

    const handleSave = async (e) => {
        e.preventDefault();
    
        const email = emailRef.current.value.trim();
        if (!email) {
            alert("Email is required to save changes.");
            return;
        }
    
        const sanitizedNumber = number.replace(/\s/g, ""); 
        const password = passwordRef.current.value;
        const confirmPassword = document.getElementById("c-confirm-password").value;
    
        const newData = {
            username: usernameRef.current.value.trim(),
            firstname: firstnameRef.current.value.trim(),
            lastname: lastnameRef.current.value.trim(),
            number: sanitizedNumber,
            email,
            password,
        };
    
        if (!newData.firstname || !newData.lastname || !newData.number || !newData.email || !newData.password) {
            alert("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please check and try again.");
            return;
        }
    
        try {
            // Get old data
            const userDoc = doc(firestore, "edit", email); // Save under "edit"
            const docSnap = await getDoc(userDoc);
    
            let oldData = {};
            if (docSnap.exists()) {
                oldData = docSnap.data();
            }
    
            // Save the updated data under "edit"
            await setDoc(userDoc, newData, { merge: true });
    
            // Save firstname in localStorage for the welcome page
            localStorage.setItem("firstname", newData.firstname);
    
            // Show before and after values
            alert(`
            Changes Saved!
            Before: 
            - Firstname: ${oldData.firstname || "N/A"}
            - Lastname: ${oldData.lastname || "N/A"}
            - Username: ${oldData.username || "N/A"}
            - Number: ${oldData.number || "N/A"}
    
            After:
            - Firstname: ${newData.firstname}
            - Lastname: ${newData.lastname}
            - Username: ${newData.username}
            - Number: ${newData.number}
            `);
    
            // Redirect to the welcome page with the new data
            window.location.href = "/welcome";
    
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === "password") {
            setPasswordVisible((prev) => !prev);
        } else if (field === "confirmPassword") {
            setConfirmPasswordVisible((prev) => !prev);
        }
    };

    return (
        <div id="edit-page">
            <form className="edit-page">

                <nav id="hamburger-nav">
                    <div className="hamburger-menu">
                        <div
                            className={`hamburger-icon ${isMenuOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className={`menu-links ${isMenuOpen ? 'active' : ''}`}>
                            <li><a href="/welcome" id='welcome' onClick={toggleMenu}>Home</a></li>
                            <li><a href="/edit" id='edit' onClick={toggleMenu}>Edit Profile</a></li>
                            <li><a href="https://kristenfolio.netlify.app/" id='about' onClick={toggleMenu}>About</a></li>
                            <li><a href="/contact" id='contact' onClick={toggleMenu}>Contact</a></li>
                            <button type="button" id="wel-mit" onClick={handleSignOut}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="edit">
                    <h1>Edit Profile</h1>
                </div>

                <form className="change-form-grid" onSubmit={handleSave}>
                    <div id="form-change">
                        <div id="label">
                            <p>User Details</p>
                            <div>
                                <input
                                    type="text"
                                    id="change-u"
                                    placeholder="New Username"
                                    ref={usernameRef}
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                    />
                                <button type="submit" id="user-btn">
                                    Change Username
                                </button>
                            </div>

                            <div className="change-container">
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    ref={firstnameRef}
                                    value={firstname}
                                    id="change-f"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <button type="submit" id="first-btn">
                                    Change Firstname
                                </button>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    ref={lastnameRef}
                                    id="change-l"
                                    />
                                    <button type="submit" id="last-btn">
                                    Change Lastname
                                </button>
                            </div>
                        </div>
                        <div id="label">
                            <p>Contact Details</p>
                            <div className="change-container">
                                <input
                                    type="tel"
                                    placeholder="012 345 6789"
                                    ref={numberRef}
                                    id="change-n"
                                    value={number}
                                    onChange={handleNumberChange}
                                    />
                                    <button type="submit" id="num-btn">
                                    Change Number
                                </button>
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="example@gmail.com"
                                    name="email"
                                    id="change-e"
                                    ref={emailRef}
                                />
                                <button type="submit" id="mail-btn">
                                    Change Email
                                </button>
                            </div>
                        </div>
                        <div id="label">
                            <p>Password</p>
                            <div className="change-password-container">

                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter your password"
                                    ref={passwordRef}
                                    autoComplete="off"
                                    id="change"
                                />
                                <img
                                    id="change-img"
                                    src={passwordVisible ? "/open.png" : "/closed.png"}
                                    alt="Show Password"
                                    width="20px"
                                    height="20px"
                                    onClick={() => togglePasswordVisibility("password")}
                                /><button type="submit" id="pass-btn">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <button type="submit" id="save" onClick={handleSave}>Save Changes</button>

            </form>
        </div>
    )
}