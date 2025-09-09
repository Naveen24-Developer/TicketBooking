import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieShowtimes from "./components/MovieShowtimes";
import SeatConfirm from "./components/SeatConfirm";
import Payment from './components/Payment';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MovieShowtimes />} />
          <Route path="/SeatConfirm" element={<SeatConfirm />} />
          <Route path="/Payment" element={<Payment />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;