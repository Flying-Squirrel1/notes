import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Home from "./Home";
import Subject from "./pages/Subject";
import Block from "./pages/Block";
import Topic from "./pages/Topic";



function App() {
  return (
    <Router>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path=":subject" element={<Subject/>} />
        <Route path="/:subject/:block" element={<Block/>} />
        <Route path="/:subject/:block/:topic" element={<Topic/>} />
      </Routes>
    </Router>
  );
}

export default App;
