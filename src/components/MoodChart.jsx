const renderMoodChart = () => {
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

  const moodPercentages = Object.keys(moodCounts).map((mood) => {
    const percentage = (moodCounts[mood] / moods.length) * 100;
    return { mood, percentage };
  });

  const mostSelectedMood = getMostSelectedMood();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-gray-200 p-4 rounded-lg">
          <h1 className="text-xl font-bold mb-8 text-gray-700">Mood Chart</h1>
          {moodPercentages.map(({ mood, percentage }) => (
            <div
              key={mood}
              className={`flex items-center justify-between bg-gray-400 p-2 rounded-full mb-2 ${
                mood === mostSelectedMood ? "font-bold" : ""
              }`}
              style={{ width: `${percentage}%` }}
            >
              <div className="text-sm font-bold">{mood}</div>
              <div className="text-sm">{percentage.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default renderMoodChart;
