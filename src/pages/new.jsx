import React, { useRef, useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./style/new.css";
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyBEy6Sh4rk9WiJHyueMVYhnRmGUeCsDQQs",
  authDomain: "signin-88f3a.firebaseapp.com",
  projectId: "signin-88f3a",
  storageBucket: "signin-88f3a.firebasestorage.app",
  messagingSenderId: "105171186737",
  appId: "1:105171186737:web:cb685e4b96161941b51110"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export default function New() {
  const [firstname, setFirstName] = useState('');
  const passwordRef = useRef();
  const [email, setEmail] = useState("");
  const confirmPasswordRef = useRef();
  const [userEmail] = useState("");
  const [userId] = useState("");
  const [password, savePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    digits: false,
    uppercase: false,
    specialChar: false,
  });

  // Function to validate the password
  const isPasswordValid = (password) => {
    const validLength = password.length >= 8;
    const validDigits = /\d/.test(password);
    const validUppercase = /[A-Z]/.test(password);
    const validSpecialChar = /[~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(
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
    const storedEmail = localStorage.getItem('email'); // Retrieve email from localStorage
    if (storedEmail) {
        setEmail(storedEmail);
        fetchUserName(storedEmail); // Fetch firstname using the email
    }
  }, []);

  const handleSavePassword = async (e) => {
    if (!email) {
      alert("Email not found. Please log in again.");
      return;
  }
  // Logic to save the password for the user with the current email
  savePassword(email, password);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const password = passwordRef.current.value.trim();
    const confirmPassword = confirmPasswordRef.current.value.trim();

    if (!password || !confirmPassword) {
      setError("* Both password fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("* Passwords do not match!");
      return;
    }

    const passwordValidation = isPasswordValid(password);
    setPasswordValid(passwordValidation);

    if (!Object.values(passwordValidation).every((valid) => valid)) {
      setError("* Password does not meet all requirements!");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("* No user is logged in!");
        return;
      }

      console.log(`User changing password: ${userEmail} (UID: ${userId})`);

      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { newPassword: password }, { merge: true });
      console.log(`Password change for: ${userId}`); // Log firstname as verification
      window.location.href = "/loginN"; // Redirect after successful save
    } catch (e) {
      console.error(e);
      setError("An error occurred while saving the password!");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserName = async (email) => {
    try {
        const docRef = doc(db, 'users', email); // Reference the document by email
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            setFirstName(userData.firstname || 'Guest'); // Set firstname or fallback to 'Guest'
            console.log(`User exists: ${email}, Name: ${userData.firstname}`);
        } else {
            console.log(`User does not exist: ${email}`);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
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
    <div style={{ display: "flex" }}>
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
          <form className="n-signup-form" onSubmit={handleSavePassword}>
            <h1>Create a New Password</h1>
            <p>Hello, {firstname}</p>
            <div className="new-password-container">
              <div className="new-password">
                <label htmlFor="password" className="new-label">
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
                  Special characters (~`!@#$%^&amp;*()-_+={}[]|\\;:&quot;&lt;&gt;,./?)
                </div>
              </ul>
            </div>

            {error && (
              <p className="error" style={{ color: "red" }}>
                {error}
              </p>
            )}
          </form>
          <button type="submit" id="new-submit-btn" onClick={handleSavePassword}>
            Submit
          </button>
          <p className="new-link">
            Remembered your password?{" "}
            <a href="/login" className="new-p-a">Login</a>
          </p>
          {loading && (
            <div className="new-loading-container">
              <div className="spinner"></div>
              <p>Verifying OTP... Please wait.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};