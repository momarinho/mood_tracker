import React, { useState, useRef, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

const Header = () => {
  const [user] = useAuthState(auth);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuRef = useRef(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then(() => {
        console.log("Signed in with Google successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error signing in with Google", error);
      });
  };

  const handleLogout = async () => {
    await auth.signOut();
    setShowMenu(false);
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [menuRef]);

  return (
    <nav className="bg-gray-700 py-4 px-8 shadow-sm">
      {showLogoutModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-900 bg-opacity-90">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Logout Confirmation
              </h2>
              <p className="mb-4">Are you sure you want to logout?</p>
              <div className="flex justify-end">
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="font-bold text-xl text-gray-100 hover:scale-105 hover:text-indigo-500"
        >
          My Mood
        </Link>

        {user ? (
          <div className="flex items-center">
            <Link
              to="/mood-form"
              className="text-gray-50 hover:underline font-medium py-2 px-4 border border-blue-500 rounded-md transition-colors duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
            >
              Add a Mood
            </Link>
            <img
              className="rounded-full ml-4 cursor-pointer w-10 h-10"
              src={user?.photoURL}
              alt={user?.displayName}
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-8 top-12 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20"
              >
                <button
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white w-full text-left"
                  onClick={() => setShowLogoutModal(true)}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
