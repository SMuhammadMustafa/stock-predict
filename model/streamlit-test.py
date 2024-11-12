import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import yfinance as yf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import datetime

# Load the trained model
@st.cache_resource
def load_keras_model():
    return load_model('keras_model.h5')

model = load_keras_model()

# Function to get stock data
def load_data(ticker, start_date, end_date):
    data = yf.download(ticker, start=start_date, end=end_date)
    data.reset_index(inplace=True)
    return data

# Function to create sequences
def create_sequences(data, sequence_length):
    sequences = []
    for i in range(len(data) - sequence_length):
        seq = data[i:i+sequence_length]
        sequences.append(seq)
    return np.array(sequences)

# Streamlit app
st.title('Stock Price Prediction App')

# User inputs
ticker = st.text_input('Enter Stock Ticker', 'TCS.NS')
start_date = st.date_input('Start Date', datetime.date(2010, 1, 1))
end_date = st.date_input('End Date', datetime.date.today())
prediction_days = st.number_input('Number of Days to Predict', min_value=1, max_value=365, value=30)

if st.button('Predict'):
    # Load data
    data = load_data(ticker, start_date, end_date)
    
    # Prepare data
    scaler = MinMaxScaler(feature_range=(0,1))
    scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1,1))
    
    # Create sequences
    sequence_length = 100  # This should match what you used during training
    sequences = create_sequences(scaled_data, sequence_length)
    
    # Make predictions
    predictions = []
    current_sequence = sequences[-1]
    for _ in range(prediction_days):
        prediction = model.predict(current_sequence.reshape(1, sequence_length, 1))
        predictions.append(prediction[0,0])
        current_sequence = np.roll(current_sequence, -1)
        current_sequence[-1] = prediction
    
    # Inverse transform predictions
    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1,1))
    
    # Create future dates for predictions
    last_date = data['Date'].iloc[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=prediction_days)
    
    # Plot results
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.plot(data['Date'], data['Close'], label='Historical Data')
    ax.plot(future_dates, predictions, label='Predictions', color='red')
    ax.set_xlabel('Date')
    ax.set_ylabel('Price')
    ax.set_title(f'{ticker} Stock Price Prediction')
    ax.legend()
    
    st.pyplot(fig)
    
    # Display predicted values
    st.write('Predicted Values:')
    prediction_df = pd.DataFrame({'Date': future_dates, 'Predicted Price': predictions.flatten()})
    st.dataframe(prediction_df)
