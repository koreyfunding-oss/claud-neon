import React, { useEffect, useState } from 'react';
import { SquarePayments } from '@square/web-payments-sdk';

const SquarePaymentComponent = () => {
    const [squarePayments, setSquarePayments] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeSquarePayments = async () => {
            try {
                const payments = await SquarePayments.initialize({
                    applicationId: 'YOUR_APPLICATION_ID',
                    locationId: 'YOUR_LOCATION_ID',
                });
                setSquarePayments(payments);
            } catch (err) {
                setError(err.message);
            }
        };
        initializeSquarePayments();
    }, []);

    const handleSubscriptionCheckout = async () => {
        if (!squarePayments) return;
        try {
            const response = await squarePayments.requestPayment();
            // Handle the response to process the subscription
            console.log('Payment Response:', response);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Subscription Checkout</h2>
            <button onClick={handleSubscriptionCheckout}>Pay with Square</button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default SquarePaymentComponent;