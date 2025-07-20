import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';
import { 
  FaSpinner, 
  FaLock, 
  FaArrowRight, 
  FaTimesCircle
} from 'react-icons/fa';
import PaymentStatusModal from '../PaymentStatus';
import './index.css';

const PaymentButton = ({ course, userData, onPaymentSuccess = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const cashfreeInstance = await load({
          mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
        });
        setCashfree(cashfreeInstance);
      } catch (err) {
        console.error('Failed to initialize Cashfree SDK:', err);
        setError('Payment system initialization failed');
      }
    };
    
    initializeSDK();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const verifyPaymentOnBackend = async (orderId) => {
    try {
      // Clear any existing interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Create new polling interval
      return new Promise((resolve) => {
        pollingIntervalRef.current = setInterval(async () => {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/payments/verify`,
              {
                params: {
                  orderId: orderId,
                  courseId: course._id,
                  userId: userData.id
                },
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              }
            );

            if (response.data && response.data[0]?.payment_status) {
              const paymentStatus = response.data[0].payment_status;
              
              if (paymentStatus === 'SUCCESS') {
                clearInterval(pollingIntervalRef.current);
                setStatus('success');
                setSuccess(true);
                onPaymentSuccess(orderId);
                resolve(true);
              } else if (paymentStatus === 'FAILED') {
                clearInterval(pollingIntervalRef.current);
                setStatus('failed');
                setError(response.data?.message || 'Payment verification failed');
                resolve(false);
              }
              // Continue polling for other statuses
            }
          } catch (err) {
            console.error('Verification error:', err);
          }
        }, 2000); // Poll every 2 seconds

        // Initial immediate check
        (async () => {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/payments/verify`,
              {
                params: {
                  orderId: orderId,
                  courseId: course._id,
                  userId: userData.id
                },
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              }
            );

            if (response.data && response.data[0]?.payment_status) {
              const paymentStatus = response.data[0].payment_status;
              
              if (paymentStatus === 'SUCCESS') {
                clearInterval(pollingIntervalRef.current);
                setStatus('success');
                setSuccess(true);
                onPaymentSuccess(orderId);
                resolve(true);
              } else if (paymentStatus === 'FAILED') {
                clearInterval(pollingIntervalRef.current);
                setStatus('failed');
                setError(response.data?.message || 'Payment verification failed');
                resolve(false);
              }
            }
          } catch (err) {
            console.error('Initial verification error:', err);
          }
        })();
      });
    } catch (err) {
      console.error('Verification setup error:', err);
      return false;
    }
  };

  const handleRetry = async () => {
    if (!orderDetails?.orderId) return;
    
    setLoading(true);
    try {
      const verified = await verifyPaymentOnBackend(orderDetails.orderId);
      if (!verified) {
        setError('Payment still processing. Please check back later.');
      }
    } catch (err) {
      setError('Could not verify payment status');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cashfree) {
      setError('Payment system is not ready yet. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setShowModal(true);
      setStatus('processing');

      const orderResponse = await axios.post(
        'http://localhost:3000/api/payments/create-order',
        {
          courseId: course._id,
          customerName: userData.name,
          customerEmail: userData.email,
          customerPhone: userData.phone || '9999999999',
          orderAmount: course.price,
          userId: userData.id
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const { order_id, payment_session_id } = orderResponse.data;
      setOrderDetails({
        orderId: order_id,
        amount: course.price,
        courseName: course.name
      });

      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
        theme: {
          navigation: {
            backgroundColor: "#2D3748",
            color: "#FFFFFF"
          }
        }
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          setStatus('failed');
          setError(result.error.message || 'Payment failed');
          return;
        }

        // Start polling immediately after checkout
        await verifyPaymentOnBackend(order_id);
      }).catch((err) => {
        console.error('Checkout error:', err);
        setStatus('failed');
        setError('Payment processing error occurred');
      });

    } catch (err) {
      console.error('Payment error:', err);
      setStatus('failed');
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Payment initiation failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-button-container">
      {error && !showModal && (
        <div className="payment-button-error">
          <FaTimesCircle className="payment-button-error-icon" />
          <span>{error}</span>
        </div>
      )}

      <button
        className="payment-button"
        onClick={handlePayment}
        disabled={loading || !cashfree}
      >
        {loading ? (
          <>
            <FaSpinner className="payment-button-spinner" />
            Processing...
          </>
        ) : (
          <>
            <FaLock className="payment-button-lock-icon" />
            Enroll Now for ₹{course.price}
            <FaArrowRight className="payment-button-arrow-icon" />
          </>
        )}
      </button>

      {showModal && (
        <PaymentStatusModal
          status={status}
          error={error}
          orderDetails={orderDetails}
          onClose={() => setShowModal(false)}
          onRetry={handleRetry}
          loading={loading}
        />
      )}
    </div>
  );
};

export default PaymentButton;