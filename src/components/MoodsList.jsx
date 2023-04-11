import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const MoodsList = () => {
  const [moods, setMoods] = useState([]);

  const [user] = useAuthState(auth);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "moods"),
      where("uid", "==", user.uid),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setMoods(data);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const getMostSelectedMood = () => {
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});

    const mostSelectedMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b
    );
    return mostSelectedMood;
  };

  const renderMoodChart = () => {
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});

    const moodPercentages = Object.keys(moodCounts).map((mood) => {
      const percentage = (moodCounts[mood] / moods.length) * 100;
      return { mood, percentage };
    });

    const mostSelectedMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b
    );

    const messages = {
      "😀 Happy":
        "Glad to hear you're feeling happy! Maybe you can do something that makes you even happier, like calling a friend or going for a walk.",
      "😢 Sad":
        "I'm sorry to hear that you're feeling sad. Maybe you can do something that makes you feel better, like watching a funny video or listening to some uplifting music.",
      "😡 Angry":
        "It sounds like you're feeling angry. Maybe you can do something that helps you calm down, like taking a few deep breaths or going for a run.",
      "😔 Depressed":
        "I'm sorry to hear that you're feeling depressed. Maybe you can do something that lifts your mood, like taking a bubble bath or doing something creative.",
      "😴 Tired":
        "It sounds like you're feeling tired. Maybe you can do something that helps you feel more awake and energized, like taking a quick nap or going for a brisk walk.",
      "😒 Frustrated":
        "I can understand why you're feeling frustrated. Maybe you can do something that helps you feel more in control, like making a to-do list or taking a break.",
      "🤩 Excited":
        "It sounds like you're feeling really excited! Maybe you can do something that helps you channel that energy, like planning a fun outing or starting a new project.",
    };

    const message = messages[mostSelectedMood];

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h1 className="text-xl font-bold mb-8 text-gray-700">Mood Chart</h1>
            <div className="mb-8">
              <p className="font-bold text-gray-700 mb-2">
                Most Selected Mood: {mostSelectedMood}
              </p>
              <p>{message}</p>
            </div>
            {moodPercentages.map(({ mood, percentage }) => (
              <div key={mood} className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-bold">{mood}</div>
                  <div className="text-sm">{percentage.toFixed(0)}%</div>
                </div>
                <div className="h-2 bg-gray-400 rounded-full">
                  <div
                    className={`h-full ${
                      mood === mostSelectedMood ? "bg-green-500" : "bg-blue-500"
                    } rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const deleteMood = async (id) => {
    try {
      await deleteDoc(doc(db, "moods", id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const sortedMoods = moods
    .slice()
    .sort((a, b) => b.date.toDate() - a.date.toDate());

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Your Moods</h2>
      </div>

      {moods.length > 0 ? (
        <>
          {renderMoodChart()}

          <ul className="my-4">
            {sortedMoods.map((mood) => (
              <li key={mood.id} className="bg-white border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-bold text-indigo-600">
                    {mood.mood}
                  </p>
                  <div
                    className={`text-sm ${
                      mood.intensity === "High"
                        ? "text-red-500"
                        : mood.intensity === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {mood.intensity}
                  </div>
                </div>
                {mood.note && (
                  <p className="text-gray-600 text-sm mb-2">{mood.note}</p>
                )}
                <p className="text-gray-600 text-sm">
                  {mood.date.toDate().toLocaleDateString()}
                </p>
                <div className="flex justify-end mt-4">
                  <Link
                    to={`/edit/${mood.id}`}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </Link>

                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteMood(mood.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-lg text-gray-600 mb-2">
            You haven't added any moods yet.
          </p>
        </div>
      )}
    </div>
  );
};
export default MoodsList;
