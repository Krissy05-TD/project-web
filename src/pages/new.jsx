import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, updatePassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router v6
import "./style/new.css";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBEy6Sh4rk9WiJHyueMVYhnRmGUeCsDQQs",
  authDomain: "signin-88f3a.firebaseapp.com",
  projectId: "signin-88f3a",
  storageBucket: "signin-88f3a.firebasestorage.app",
  messagingSenderId: "105171186737",
  appId: "1:105171186737:web:cb685e4b96161941b51110",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function New() {
  const [firstname, setFirstName] = useState("");
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [userId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    digits: false,
    uppercase: false,
    specialChar: false,
  });

  const formRef = useRef(); // Reference to the form
  const navigate = useNavigate(); // Use navigate hook for React Router v6

  const isPasswordValid = (password) => {
    const validLength = password.length >= 8;
    const validDigits = /\d/.test(password);
    const validUppercase = /[A-Z]/.test(password);
    const validSpecialChar = /[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(
      password
    );

    return {
      length: validLength,
      digits: validDigits,
      uppercase: validUppercase,
      specialChar: validSpecialChar,
    };
  };

  useEffect(() => {
    const storedFirstname = localStorage.getItem("firstname");
    if (storedFirstname) {
      setFirstName(storedFirstname);
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user.email);
      } else {
        console.log("No user logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const passwordRequirements =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const handleSavePassword = async (e) => {
      if (e) e.preventDefault(); // Prevent default form submission
    
      console.log("handleSavePassword function is running");
      setError("");
    
      const password = passwordRef.current.value.trim();
      const confirmPassword = confirmPasswordRef.current.value.trim();
    
      console.log("Password entered:", password);
      console.log("Confirm password entered:", confirmPassword);
    
      if (!password || !confirmPassword) {
        setError("* Both password fields are required!");
        console.log("Error: Both password fields are required!");
        return;
      }
    
      if (password !== confirmPassword) {
        setError("* Passwords do not match!");
        console.log("Error: Passwords do not match!");
        return;
      }
    
      if (!passwordRequirements.test(password)) {
        setError(
          "* Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        console.log("Error: Password requirements not met!");
        return;
      }
    
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("* No user is logged in!");
          console.log("Auth currentUser is null. Redirecting to login.");
          navigate("/login"); // Redirect user to login if not logged in
          return;
        }
    
        const storedFirstname = localStorage.getItem("firstname");
        if (!storedFirstname) {
          setError("* Firstname not found!");
          console.log("Error: Firstname not found in localStorage");
          return;
        }
    
        // Update password in Firebase Authentication
        await updatePassword(user, password);
        console.log("Firebase password updated");
    
        // Store the new password in Firestore
        const userDocRef = doc(db, "login", storedFirstname);
        await setDoc(userDocRef, { firstname: storedFirstname, password });
    
        console.log(`Password successfully updated for ${storedFirstname}`);
    
        // ✅ Redirect to loginN page after success
        navigate("/loginN");
      } catch (e) {
        console.error("Error while saving password:", e);
        setError("An error occurred while saving the password!");
      } finally {
        setLoading(false);
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
    <div className="new">
      <div className="new-left">
        <div>
          <h1>
            <img src="/logo.jpeg" alt="Four Leaf Clover" />
            Project 1
          </h1>
        </div>
      </div>

      <div className="new-right">
        <form
          ref={formRef}
          className="n-signup-form"
          onSubmit={handleSavePassword}
        >
          <h1>Create a New Password</h1>
          <p>Hello, {firstname}</p>
          <div className="new-password-container">
            <div className="new-password">
              <label htmlFor="new-password" className="new-label">
                New Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="n-password"
                placeholder="Enter a New Password"
                ref={passwordRef}
                onChange={(e) => {
                  const validation = isPasswordValid(e.target.value);
                  setPasswordValid(validation);
                }}
              />
              <img
                id="new-t-check"
                src={passwordVisible ? "/open.png" : "/closed.png"}
                alt="Toggle Password"
                width="20px"
                height="20px"
                onClick={() => togglePasswordVisibility("password")}
              />
            </div>

            <div className="confirm-password">
              <label htmlFor="confirm-password" className="new-label">
                Confirm Password
              </label>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="n-confirm"
                placeholder="Confirm New Password"
                ref={confirmPasswordRef}
              />
              <img
                id="new-check"
                src={confirmPasswordVisible ? "/open.png" : "/closed.png"}
                alt="Toggle Password"
                width="20px"
                height="20px"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              />
            </div>
            <div className="new-requirements">
              <p>Password must contain:</p>
              <ul id="new-requirements-list">
                <div className={passwordValid.length ? "valid" : "invalid"}>
                  At least 8 characters
                </div>
                <div className={passwordValid.digits ? "valid" : "invalid"}>
                  At least 1 number
                </div>
                <div className={passwordValid.uppercase ? "valid" : "invalid"}>
                  Uppercase and Lowercase letters
                </div>
                <div
                  className={passwordValid.specialChar ? "valid" : "invalid"}
                >
                  Special characters (~!@#$%^&amp;*()-_+={}
                  []|\\;:&quot;&lt;&gt;,./?)
                </div>
              </ul>
            </div>
          </div>

          {error && (
            <p className="error" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </form>

        <button
          type="submit"
          id="new-submit-btn"
          onClick={(e) => {
            console.log("Submit button clicked");
            handleSavePassword(e);
          }}
        >
          Submit
        </button>

        <p className="new-link">
          Remembered your password?{" "}
          <a href="/login" className="new-p-a">
            Login
          </a>
        </p>

        {loading && (
          <div className="new-loading-container">
            <div className="spinner"></div>
            <p>Verifying OTP... Please wait.</p>
          </div>
        )}
      </div>
    </div>
  );
}
