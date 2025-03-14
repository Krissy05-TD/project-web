import React, { useState, useRef } from "react";
import { firestore } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./style/edit.css";

export default function Edit() {
  const [username, setUserName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState("");

  const userDocRef = useRef("");
  const usernameRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const numberRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSignOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("firstname");
    window.location.href = "/loginN";
  };

  const handleNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 3 && input.length <= 6) {
      input = input.slice(0, 3) + " " + input.slice(3);
    } else if (input.length > 6) {
      input =
        input.slice(0, 3) + " " + input.slice(3, 6) + " " + input.slice(6, 10);
    }
    setNumber(input);
  };

  const updateField = async (field, value) => {
    const userEmail = localStorage.getItem("email"); // Get email from localStorage
    if (!userEmail) {
      alert("User email not found. Please log in again.");
      return;
    }

    if (!value.trim()) {
      alert(`Please enter a valid ${field}.`);
      return;
    }

    const newData = { [field]: value }; // Correctly defining newData
    console.log("Updating:", { field, value });


    try {
      const userDocRef = doc(firestore, "edits", userEmail);
      await setDoc(userDocRef, newData, { merge: true });

      if (field === "firstname") {
        localStorage.setItem("firstname", value); // Update localStorage
      }

      alert(`${field} updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Failed to update ${field}. Please try again.`);
    } 
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !usernameRef.current ||
      !firstnameRef.current ||
      !lastnameRef.current ||
      !numberRef.current ||
      !emailRef.current ||
      !passwordRef.current
    ) {
      alert("One or more input fields are not initialized.");
      return;
    }

    const userEmail = emailRef.current.value.trim();
    if (!userEmail) {
      alert("Email is required to save changes.");
      return;
    }

    const newData = {
      username: usernameRef.current.value.trim(),
      firstname: firstnameRef.current.value.trim(),
      lastname: lastnameRef.current.value.trim(),
      number: number.replace(/\s/g, ""), // Removing spaces
      email: userEmail,
      password: passwordRef.current.value,
    };

    console.log("Saving Data:", newData); // Debugging

    try {
      const userDocRef = doc(firestore, "edits", userEmail);
      await setDoc(userDocRef, newData, { merge: true });

      localStorage.setItem("firstname", newData.firstname);
      alert("All changes saved successfully!");
      window.location.href = "/welcomes";
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div id="edit-page">
      <form className="edit-page">
        <nav id="hamburger-nav">
          <div className="hamburger-menu">
            <div
              className="hamburger-icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={`menu-links ${isMenuOpen ? "active" : ""}`}>
              <li>
                <a href="/welcome">Home</a>
              </li>
              <li>
                <a href="/edit">Edit Profile</a>
              </li>
              <li>
                <a href="https://kristenfolio.netlify.app/">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
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
                  onClick={handleSave}
                />
                <button
                  type="button"
                  id="user-btn"
                  onClick={() => updateField("username", username)}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    console.log("First Name Updated:", e.target.value);
                  }}
                >
                  Change Username
                </button>
              </div>

              <div>
                <input
                  type="text"
                  id="change-f"
                  placeholder="Enter First Name"
                  ref={firstnameRef}
                  value={firstname} // Ensure full name is displayed
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    console.log("First Name Updated:", e.target.value); // Debugging
                  }}
                />
                <button
                  type="button"
                  id="first-btn"
                  onClick={() => updateField("firstname", firstname)}
                >
                  Change Firstname
                </button>
              </div>

              <div>
                <input
                  type="text"
                  id="change-l"
                  placeholder="Enter Last Name"
                  ref={lastnameRef}
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <button
                  type="button"
                  id="last-btn"
                  onClick={() => updateField("lastname", lastname)}
                >
                  Change Lastname
                </button>
              </div>
            </div>

            <div id="label">
              <p>Contact Details</p>
              <div>
                <input
                  type="tel"
                  id="change-n"
                  placeholder="012 345 6789"
                  ref={numberRef}
                  value={number}
                  onChange={handleNumberChange}
                />
                <button
                  type="button"
                  id="num-btn"
                  onClick={() => updateField("number", number)}
                >
                  Change Number
                </button>
              </div>

              <div>
                <input
                  type="email"
                  id="change-e"
                  placeholder="example@gmail.com"
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  id="mail-btn"
                  onClick={() => updateField("email", email)}
                >
                  Change Email
                </button>
              </div>
            </div>

            <div id="label">
              <p>Password</p>
              <div>
                <input
                  type="password"
                  id="change-p"
                  placeholder="Enter your password"
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" id="pass-btn" onClick={handleSave}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </form>
        <button
          type="submit"
          id="save"
          onClick={handleSave}
          onChange={userDocRef}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
