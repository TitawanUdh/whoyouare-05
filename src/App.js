import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import QuestionPage from "./components/questionPage";
import Result from "./components/results";
import LoadingResult from "./components/loading";

function App() {
  const [answers, setAnswers] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/question/:id"
          element={<QuestionPage answers={answers} setAnswers={setAnswers} />}
        />

        <Route path="/loading" element={<LoadingResult />} />
        <Route
          path="/result"
          element={<Result answers={answers} setAnswers={setAnswers} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
