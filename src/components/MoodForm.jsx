import { useState } from "react";
import { auth, db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const MoodForm = () => {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [intensity, setIntensity] = useState("");
  const [error, setError] = useState("");
  const [uid, setUid] = useState("");

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleAddMood = async (event) => {
    event.preventDefault();
    const docRef = await addDoc(collection(db, "moods"), {
      mood,
      note,
      uid: user.uid,
      intensity,
      date: new Date(),
    });
    console.log("New post added with ID: ", docRef.id);
    setMood("");
    setNote("");
    setDate("");
    setUid("");
    setError("");
    navigate(-1);
  };

  return (
    <form onSubmit={handleAddMood} className="max-w-md mx-auto">
      <div className="mb-4 mt-8">
        <label htmlFor="mood" className="block text-gray-700 font-bold mb-2">
          Current Mood:
        </label>
        <select
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="" disabled>
            Select your current mood
          </option>
          <option value="😀 Happy">😀 Happy</option>
          <option value="😢 Sad">😢 Sad</option>
          <option value="😡 Angry">😡 Angry</option>
          <option value="😔 Depressed">😔 Depressed</option>
          <option value="😴 Tired">😴 Tired</option>
          <option value="😒 Frustrated">😒 Frustrated</option>
          <option value="🤩 Excited">🤩 Excited</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="intensity"
          className="block text-gray-700 font-bold mb-2"
        >
          Intensity
        </label>
        <div className="flex items-center">
          <div className="w-1/6 text-sm text-gray-600">{intensity}</div>
          <div className="w-5/6">
            <input
              type="range"
              id="intensity"
              className="slider"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              min="1"
              max="10"
              required
            />
          </div>
        </div>
       
      </div>
    
      <div className="mb-4">
        <label htmlFor="note" className="block text-gray-700 font-bold mb-2">
          Notes (optional):
        </label>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter any notes here"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
          Date:
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-center mt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Mood
        </button>
      </div>
      <p className="mt-4 text-gray-600 text-sm text-center">
        Select your current mood from the dropdown menu. Enter any notes you'd
        like to include (optional). Select the date when you felt this way.
      </p>
    </form>
  );
};

export default MoodForm;
