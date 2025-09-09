import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MovieShowtimes.css';

const MovieShowtimes = () => {
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [seatCount, setSeatCount] = useState(0);
  const navigate = useNavigate();

  const dates = [
    { day: 'MON', date: '01', month: 'SEP' },
    { day: 'TUE', date: '02', month: 'SEP' },
    { day: 'WED', date: '03', month: 'SEP' },
    { day: 'THU', date: '04', month: 'SEP' },
    { day: 'FRI', date: '05', month: 'SEP' },
    { day: 'SAT', date: '06', month: 'SEP' },
    { day: 'SUN', date: '07', month: 'SEP' },
  ];

  const showtimes = ['10:00 AM', '11:00 AM', '02:30 PM', '06:30 PM'];

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowSeatModal(true);
  };

  const handleSeatSelect = (count) => {
    setSeatCount(count);
  };

  const confirmSeats = () => {
    // Navigate to seat confirmation page with selected parameters
    navigate('/SeatConfirm', { 
      state: { 
        seatCount, 
        movie: 'Coolie', 
        time: selectedTime,
        date: `2025-09-0${selectedDate}`,
        cinema: 'Cosmo cinemas Peelamedu AC 4K RGB',
        location: 'Coimbatore'
      } 
    });
  };

  return (
    <div className="movie-showtimes">
      <div className="movie-header">
        <div className="movie-title">
          <img className="movie-image" src="https://cdn.district.in/movies-assets/images/cinema/Coolie_2_Poster-33dfdd70-71f9-11f0-8de0-9d1c38983d05.jpg" alt="movie" />
          <div className="title-rating-container">
            <h1>Coolie</h1>
            <div className="rating">
              <span className="rating-value">7.6/10</span>
              <button className="rate-button">Rate now</button>
            </div>
          </div>
        </div>
        <div className="movie-actions">
          <button className="view-details">View Details</button>
          <button className="share">Share</button>
        </div>
      </div>

      <div className="calendar-section">
        <div className="calendar-header">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`date-item ${selectedDate === parseInt(date.date) ? 'selected' : ''}`}
              onClick={() => setSelectedDate(parseInt(date.date))}
            >
              <span className="day">{date.day}</span>
              <span className="date">{date.date}</span>
              <span className="month">{date.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="filters-section">
        <div className="filters">
          <input 
            type="text" 
            placeholder="Search by cinema or area" 
            className="search-input"
          />
        </div>
      </div>

      <div className="cinema-section">
        <div className="cinema-info">
          <h3 className="cinema-name">Cosmo cinemas Peelamedu AC 4K RGB</h3>
          <p className="cinema-location">Laser: Coimbatore</p>
        </div>

        <div className="showtimes">
          {showtimes.map((time, index) => (
            <div
              key={index}
              className={`showtime ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => handleTimeSelect(time)}
            >
              <span className="time">{time}</span>
              <span className="format">DOLEY ATMOS</span>
            </div>
          ))}
        </div>
      </div>

      {showSeatModal && (
        <div className="modal-overlay">
          <div className="seat-modal">
            <div className="modal-header">
              <h2>How many Seats?</h2>
              <button className="close-button" onClick={() => setShowSeatModal(false)}>×</button>
            </div>
            
            <div className="seat-options">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  className={`seat-option ${seatCount === num ? 'selected' : ''}`}
                  onClick={() => handleSeatSelect(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            
            <div className="price-info">
              <div className="price-tier">
                <span className="price">₹150.00</span>
                <span className="tier">Platinum</span>
                <span className="availability">Available</span>
              </div>
              <div className="price-tier">
                <span className="price">₹150.00</span>
                <span className="tier">Gold</span>
                <span className="availability">Available</span>
              </div>
            </div>
            
            <button 
              className={`select-seats-button ${seatCount === 0 ? 'disabled' : ''}`} 
              onClick={confirmSeats}
              disabled={seatCount === 0}
            >
              Select Seats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieShowtimes;