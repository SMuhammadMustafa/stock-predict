import pandas as pd
import ta

# Function to calculate SMA (Simple Moving Average)
def calculate_sma(df, window=14):
    df['SMA'] = df['close'].rolling(window=window).mean()
    return df

# Function to calculate EMA (Exponential Moving Average)
def calculate_ema(df, window=14):
    df['EMA'] = df['close'].ewm(span=window, adjust=False).mean()
    return df

# Function to calculate RSI (Relative Strength Index)
def calculate_rsi(df, window=14):
    df['RSI'] = ta.momentum.RSIIndicator(df['close'], window=window).rsi()
    return df

# Combine all indicators and clean NaN values
def calculate_indicators(df, indicator, window):
    if indicator == "RSI":
        df = calculate_rsi(df, window)
    elif indicator == "EMA":
        df = calculate_ema(df, window)
    elif indicator == "SMA":
        df = calculate_sma(df, window)
    else:
        ValueError("Error: Indicator name not recognized")
        
    # Option 1: Drop NaN values
    df_cleaned = df.dropna()

    # Option 2: Fill NaN values (e.g., with 0, or forward fill with the previous value)
    # df_cleaned = df.fillna(0)  # Fill with 0
    # df_cleaned = df.fillna(method='ffill')  # Forward fill with previous valid value

    return df_cleaned
