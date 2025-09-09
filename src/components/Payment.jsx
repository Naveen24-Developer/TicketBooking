import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    seatCount, 
    selectedSeats, 
    movie, 
    time, 
    date, 
    cinema, 
    cinemaLocation,
    totalAmount 
  } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [email] = useState('m.naveen24kumar@gmail.com');
  const [phone] = useState('8825869121');
  const [state] = useState('Tamilnadu');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const convenienceFee = 70;
  const orderTotal = totalAmount + convenienceFee;
  
  const handlePayment = () => {
    // Mark seats as booked in localStorage (permanent booking)
    const bookedSeats = JSON.parse(localStorage.getItem('seatBookings')) || [];
    const newBookedSeats = [...bookedSeats, ...selectedSeats];
    localStorage.setItem('seatBookings', JSON.stringify(newBookedSeats));
    
    // Clear temporary selections from sessionStorage
    sessionStorage.removeItem('tempSelectedSeats');
    
    // Show confirmation popup
    setShowConfirmation(true);
  };
  
  const handleBack = () => {
    // Keep the temporary selections in sessionStorage when going back
    // so they remain selected when returning to seat selection
    navigate(-1);
  };
  
  const handleBackHome = () => {
    // Navigate back to MovieShowtimes page
    navigate('/');
  };
  
  return (
    <div className="payment-container">
      <header className="payment-header">
        <h1>{movie || 'Coolie'} - (Tamil)</h1>
        <div className="show-info">
          <p>{cinema || 'Cosmo cinemas PEELAMEDU AC 4K RGB'} | {cinemaLocation || 'Coimbatore'} | {date ? new Date(date).toDateString() : 'Tue, 02 September, 2025'} | {time || '11:00 AM'}</p>
        </div>
        <div className="selected-seats-info">
          <p>Selected Seats: {selectedSeats?.join(', ') || 'None'}</p>
        </div>
      </header>
      
      <div className="payment-content">
        <div className="payment-options">
          <h2>Payment Option</h2>
          
          <div className="payment-method">
            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'upi'} 
                onChange={() => setPaymentMethod('upi')} 
              />
              <span className="checkmark"></span>
              UPI
              <div className="payment-subtext">Google Pay | Phone Pay | Paytm</div>
            </label>
            
            <label className={`payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'wallet'} 
                onChange={() => setPaymentMethod('wallet')} 
              />
              <span className="checkmark"></span>
              Wallet
              <div className="payment-subtext">Balance: ₹120.00</div>
            </label>
            
            <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')} 
              />
              <span className="checkmark"></span>
              Card
              <div className="payment-subtext">Visa *****4216</div>
            </label>
            
            <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'cash'} 
                onChange={() => setPaymentMethod('cash')} 
              />
              <span className="checkmark"></span>
              Cash
              <div className="payment-subtext">Pay at end of ride</div>
            </label>
          </div>
          
          <div className="payment-actions">
            <button className="back-button" onClick={handleBack}>Back</button>
            <button className="pay-button" onClick={handlePayment}>
              Pay and Finish Ride
            </button>
          </div>
        </div>
        
        <div className="fare-summary">
          <h2>Fare Summary</h2>
          
          <div className="fare-details">
            <div className="fare-item">
              <span>Ticket Price</span>
              <span>₹{totalAmount?.toFixed(2) || '300.00'}</span>
            </div>
            
 
            
            <div className="fare-item">
              <span>Convenience Fees</span>
              <span>₹{convenienceFee.toFixed(2)}</span>
            </div>
            
            <div className="fare-item total">
              <span>Order Total</span>
              <span>₹{orderTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="user-details">
            <h3>Your Details (For sending booking details)</h3>
            <p>{email}</p>
            <p>{phone} | {state}</p>
          </div>
          
          <div className="amount-payable">
            <h3>Amount Payable</h3>
            <p className="total-amount">₹{orderTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="confirmation-popup-overlay">
          <div className="confirmation-popup">
            <div className="popup-content">
              <h2>Thank you for your order</h2>
              <p>Your ticket has been sent to your email address:</p>
              <p className="email-address">naveen2345@gmail.com</p>
              
              <div className="booking-details">
                <h3>{movie || 'Coolie'} - (Tamil)</h3>
                <p>{cinema || 'PEELAMEDU AC'}</p>
                <p>{time || '11:00 AM'} | {date ? new Date(date).toDateString() : 'Tue, 02 Sep 2025'}</p>
                <p>Seats: {selectedSeats?.join(', ') || 'None'}</p>
              </div>
              
              <button className="back-home-button" onClick={handleBackHome}>
                Back Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;