import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MoodForm from "./components/MoodForm";
import Home from "./screens/Home";
import Header from "./components/Header";
import EditMood from "./components/EditMood";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mood-form" element={<MoodForm />} />
          <Route path="/edit/:id" element={<EditMood />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
