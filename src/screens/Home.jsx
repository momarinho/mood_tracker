import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import MoodsList from '../components/MoodsList';

const HomePage = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="flex flex-col items-center justify-center">
      {user ? (
        <MoodsList />
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8 mt-8">Hello there!</h1>
          <h1 className="text-lg mb-4">Welcome to "My Mood"</h1>
          <p className="text-gray-500 mb-4">Please login to continue...</p>
        </>
      )}
    </div>
  );
};

export default HomePage;
