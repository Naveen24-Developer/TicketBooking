import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SeatConfirm.css';

const SeatConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { seatCount, movie, time, date, cinema, location: cinemaLocation } = location.state || {};
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [temporarySelectedSeats, setTemporarySelectedSeats] = useState([]);
  
  // Sample seat layout data
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 15;
  
  // Load booked seats from localStorage on component mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('seatBookings')) || [];
    setBookedSeats(savedBookings);
    
    // Load any temporarily selected seats from sessionStorage
    const tempSeats = JSON.parse(sessionStorage.getItem('tempSelectedSeats')) || [];
    setTemporarySelectedSeats(tempSeats);
    
    // If we're coming back from payment page without completing payment,
    // restore the selected seats from sessionStorage
    if (tempSeats.length > 0) {
      setSelectedSeats(tempSeats);
    }
  }, []);
  
  // Check if a seat is already booked
  const isSeatBooked = (seatId) => {
    return bookedSeats.includes(seatId);
  };
  
  // Check if a seat is available (not booked)
  const isSeatAvailable = (rowIndex, seatIndex) => {
    const seatId = `${rows[rowIndex]}${seatIndex + 1}`;
    return !isSeatBooked(seatId);
  };
  
  // Check if a seat is selected (temporarily)
  const isSeatSelected = (seatId) => {
    return selectedSeats.includes(seatId);
  };
  
  // Find adjacent seats in the same row
  const findAdjacentSeats = (startSeatId, count) => {
    const row = startSeatId.charAt(0);
    const startNum = parseInt(startSeatId.slice(1));
    const adjacentSeats = [];
    
    // Try to find seats to the right first
    for (let i = 0; i < count; i++) {
      const seatNum = startNum + i;
      const seatId = `${row}${seatNum}`;
      
      // Check if seat exists and is available
      if (seatNum <= seatsPerRow && isSeatAvailable(rows.indexOf(row), seatNum - 1) && !isSeatBooked(seatId)) {
        adjacentSeats.push(seatId);
      } else {
        break;
      }
    }
    
    // If we found enough seats to the right, return them
    if (adjacentSeats.length === count) {
      return adjacentSeats;
    }
    
    // If not, try to find seats to the left
    adjacentSeats.length = 0; // Clear the array
    for (let i = 0; i < count; i++) {
      const seatNum = startNum - i;
      const seatId = `${row}${seatNum}`;
      
      // Check if seat exists and is available
      if (seatNum >= 1 && isSeatAvailable(rows.indexOf(row), seatNum - 1) && !isSeatBooked(seatId)) {
        adjacentSeats.unshift(seatId); // Add to beginning to maintain order
      } else {
        break;
      }
    }
    
    // If we found enough seats to the left, return them
    if (adjacentSeats.length === count) {
      return adjacentSeats;
    }
    
    // If we still don't have enough seats, return what we have
    return adjacentSeats;
  };
  
  // Handle seat selection
  const toggleSeatSelection = (seatId) => {
    // If the seat is already selected, deselect it and all adjacent seats
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats([]);
      setTemporarySelectedSeats([]);
      sessionStorage.removeItem('tempSelectedSeats');
      return;
    }
    
    // If no seats are selected yet, try to find adjacent seats
    if (selectedSeats.length === 0) {
      const adjacentSeats = findAdjacentSeats(seatId, seatCount);
      
      if (adjacentSeats.length === seatCount) {
        setSelectedSeats(adjacentSeats);
        setTemporarySelectedSeats(adjacentSeats);
        sessionStorage.setItem('tempSelectedSeats', JSON.stringify(adjacentSeats));
      } else {
        // If we can't find enough adjacent seats, just select the clicked seat
        setSelectedSeats([seatId]);
        setTemporarySelectedSeats([seatId]);
        sessionStorage.setItem('tempSelectedSeats', JSON.stringify([seatId]));
      }
    } else {
      // If some seats are already selected, clear and try to find new adjacent seats
      const adjacentSeats = findAdjacentSeats(seatId, seatCount);
      
      if (adjacentSeats.length === seatCount) {
        setSelectedSeats(adjacentSeats);
        setTemporarySelectedSeats(adjacentSeats);
        sessionStorage.setItem('tempSelectedSeats', JSON.stringify(adjacentSeats));
      } else {
        setSelectedSeats([seatId]);
        setTemporarySelectedSeats([seatId]);
        sessionStorage.setItem('tempSelectedSeats', JSON.stringify([seatId]));
      }
    }
  };
  
  // Handle payment process
  const handleProceedToPay = () => {
    if (selectedSeats.length === seatCount) {
      // Save the selected seats to sessionStorage to maintain state if user navigates back
      sessionStorage.setItem('tempSelectedSeats', JSON.stringify(selectedSeats));
      
      // Navigate to payment page with selected parameters
      navigate('/payment', { 
        state: { 
          seatCount, 
          selectedSeats, 
          movie, 
          time, 
          date, 
          cinema, 
          cinemaLocation,
          totalAmount: seatCount * 150
        } 
      });
    }
  };
  
  // Clear temporary selections when component unmounts (if payment was not completed)
  useEffect(() => {
    return () => {
      // Only clear if we're not navigating to payment page
      if (!window.location.pathname.includes('/Payment')) {
        sessionStorage.removeItem('tempSelectedSeats');
      }
    };
  }, []);
  
  return (
    <div className="seat-confirm-container">
      <header className="booking-header">
        <div className="movie-info">
          <h1>{movie || 'Coolie'}</h1>
          <p>U • Tamil</p>
        </div>
        <div className="show-details">
          <p>{time || '10:00 AM'}</p>
          <p>{date ? new Date(date).toDateString() : 'Mon, 01 Sep 2025'}</p>
        </div>
        <div className="cinema-details">
          <h3>{cinema || 'Cosmo cinemas Peelamedu AC 4K RGB'}</h3>
          <p>{cinemaLocation || 'Coimbatore'}</p>
        </div>
      </header>
      
        
        <div className="seat-layout">
          {rows.map((row, rowIndex) => (
            <div key={row} className="seat-row">
              <div className="row-label">{row}</div>
              <div className="seats">
                {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                  const seatId = `${row}${seatIndex + 1}`;
                  const available = isSeatAvailable(rowIndex, seatIndex);
                  const booked = isSeatBooked(seatId);
                  const selected = isSeatSelected(seatId);
                  
                  return (
                    <div
                      key={seatId}
                      className={`seat ${booked ? 'booked' : available ? 'available' : 'unavailable'} ${selected ? 'selected' : ''}`}
                      onClick={() => !booked && available && toggleSeatSelection(seatId)}
                    >
                      {seatIndex + 1}
                    </div>
                  );
                })}
              </div>
              <div className="row-label">{row}</div>
            </div>
          ))}
        <div className="seat-layout-container">
        <div className="screen-indicator">SCREEN THIS WAY</div>
        <div className="screen">
        </div>
        </div>
        

        
        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat-sample available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat-sample unavailable"></div>
            <span>Unavailable</span>
          </div>
          <div className="legend-item">
            <div className="seat-sample selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="seat-sample booked"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
      
      <div className="booking-summary">
        <div className="selected-seats-info">
          <h3>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</h3>
          <p>Total Amount: ₹{selectedSeats.length * 150}</p>
        </div>
        
        <div className="action-buttons">
          <button className="back-button" onClick={() => {
            sessionStorage.removeItem('tempSelectedSeats');
            navigate(-1);
          }}>Back</button>
          <button 
            className={`proceed-button ${selectedSeats.length === seatCount ? '' : 'disabled'}`}
            onClick={handleProceedToPay}
            disabled={selectedSeats.length !== seatCount}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatConfirm;