import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const EditMood = () => {
  const [user] = useAuthState(auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const [mood, setMood] = useState("");
  const [intensity, setIntensity] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchMood = async () => {
      const docRef = doc(db, "moods", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { mood, intensity, note } = docSnap.data();
        setMood(mood);
        setIntensity(intensity);
        setNote(note);
      } else {
        console.log("No such document!");
      }
    };
    fetchMood();
  }, [id]);

  const handleUpdateMood = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "moods", id);
    await updateDoc(docRef, {
      mood,
      intensity,
      note,
      uid: user.uid,
      date: new Date(),
    });
    navigate("/");
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Edit Mood</h2>
      <form onSubmit={handleUpdateMood}>
        <div className="mb-4">
          <label htmlFor="mood" className="block text-gray-700 font-bold mb-2">
            Mood
          </label>
          <select
            id="mood"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
          >
            <option value="">Select Mood</option>
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
          <input
            type="range"
            id="intensity"
            className="shadow appearance-none border rounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            min="1"
            max="10"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="note" className="block text-gray-700 font-bold mb-2">
            Note
          </label>
          <textarea
            id="note"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMood;
