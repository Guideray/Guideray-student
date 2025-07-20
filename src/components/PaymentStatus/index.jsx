import React, { useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner,
  FaHome,
  FaBook,
  FaReceipt,
  FaShieldAlt,
  FaSyncAlt
} from 'react-icons/fa';
import './index.css';

const PaymentStatusModal = ({ 
  status, 
  error, 
  orderDetails, 
  onClose, 
  onRetry,
  loading 
}) => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'CF_MODAL_CLOSED' && (status === null || status === 'processing')) {
        console.log('Cashfree popup closed - triggering status refresh');
        onRetry();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [status, onRetry]);

  const getStatusContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="payment-status-modal-success">
            <div className="payment-status-modal-icon">
              <FaCheckCircle />
            </div>
            <h2>Payment Successful!</h2>
            <p className="payment-status-modal-message">
              Thank you for your payment. Your enrollment is now complete.
            </p>
            
            <div className="payment-status-modal-details">
              <div className="payment-status-modal-row">
                <FaBook className="payment-status-modal-detail-icon" />
                <div>
                  <span className="payment-status-modal-label">Course:</span>
                  <span className="payment-status-modal-value">{orderDetails?.courseName}</span>
                </div>
              </div>
              
              <div className="payment-status-modal-row">
                <FaReceipt className="payment-status-modal-detail-icon" />
                <div>
                  <span className="payment-status-modal-label">Order ID:</span>
                  <span className="payment-status-modal-value">{orderDetails?.orderId}</span>
                </div>
              </div>
              
              <div className="payment-status-modal-row">
                <FaShieldAlt className="payment-status-modal-detail-icon" />
                <div>
                  <span className="payment-status-modal-label">Amount Paid:</span>
                  <span className="payment-status-modal-value">₹{orderDetails?.amount}</span>
                </div>
              </div>
            </div>
            
            <div className="payment-status-modal-actions">
              <button 
                className="payment-status-modal-primary-button" 
                onClick={onClose}
              >
                <FaBook /> Go to Course
              </button>
              <button 
                className="payment-status-modal-secondary-button" 
                onClick={onClose}
              >
                <FaHome /> Back to Home
              </button>
            </div>
          </div>
        );
      
      case 'failed':
        return (
          <div className="payment-status-modal-failed">
            <div className="payment-status-modal-icon">
              <FaTimesCircle />
            </div>
            <h2>Payment Failed</h2>
            <p className="payment-status-modal-message">
              {error || 'We couldn\'t process your payment. Please try again.'}
            </p>
            
            <div className="payment-status-modal-actions">
              <button 
                className="payment-status-modal-primary-button" 
                onClick={onRetry}
                disabled={loading}
              >
                {loading ? (
                  <><FaSpinner className="payment-status-modal-spinner" /> Checking...</>
                ) : (
                  <><FaSyncAlt /> Try Again</>
                )}
              </button>
              <button 
                className="payment-status-modal-secondary-button" 
                onClick={onClose}
              >
                <FaHome /> Back to Home
              </button>
            </div>
          </div>
        );
      
      case 'pending':
        return (
          <div className="payment-status-modal-pending">
            <div className="payment-status-modal-icon">
              <FaSpinner className="payment-status-modal-spinner" />
            </div>
            <h2>Payment Processing</h2>
            <p className="payment-status-modal-message">
              Your payment is being processed. Please check back later.
            </p>
            
            <div className="payment-status-modal-actions">
              <button 
                className="payment-status-modal-primary-button" 
                onClick={onRetry}
                disabled={loading}
              >
                {loading ? (
                  <><FaSpinner className="payment-status-modal-spinner" /> Checking...</>
                ) : (
                  <><FaSyncAlt /> Check Status</>
                )}
              </button>
              <button 
                className="payment-status-modal-secondary-button" 
                onClick={onClose}
              >
                <FaHome /> Back to Home
              </button>
            </div>
          </div>
        );
      
      default: // processing
        return (
          <div className="payment-status-modal-processing">
            <div className="payment-status-modal-icon">
              <FaSpinner className="payment-status-modal-spinner" />
            </div>
            <h2>Processing Payment</h2>
            <p className="payment-status-modal-message">
              Please wait while we process your transaction...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="payment-status-modal-overlay">
      <div className="payment-status-modal">
        <div className="payment-status-modal-content">
          {getStatusContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusModal;