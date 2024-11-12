from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
from indicators import calculate_indicators  # Import the function from the script above

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Directory where your parquet files are stored
PARQUET_DIR = '../data'

# Function to read parquet file for a specific stock ticker
def read_parquet_file(file_path):
    try:
        df = pd.read_parquet(file_path)
        return df
    except Exception as e:
        print(f"Error reading Parquet file: {e}")
        raise

# API route to serve stock data for a specific ticker
@app.route('/api/stock-data/<ticker>', methods=['GET'])
def get_stock_data(ticker):
    file_path = os.path.join(os.getcwd(), f'../data/{ticker}.parquet')

    if not os.path.exists(file_path):
        return jsonify({"error": f"File for ticker '{ticker}' not found"}), 404
    
    try:
        # Read the Parquet file and return the data
        data = read_parquet_file(file_path)
        # Convert to list of dictionaries to make it JSON serializable
        data_dict = data.to_dict(orient='records')
        return jsonify(data_dict)
    except Exception as e:
        return jsonify({"error": "Failed to read Parquet file"}), 500

# API route to get stock indicators for a specific ticker and indicator type
@app.route('/api/stock-indicators/<ticker>/<indicator>/<window>', methods=['GET'])
def get_stock_indicator_data(ticker, indicator, window):
    file_path = os.path.join(os.getcwd(), f'../data/{ticker}.parquet')

    if not os.path.exists(file_path):
        return jsonify({"error": f"File for ticker '{ticker}' not found"}), 404

    try:
        # Read stock data
        df = read_parquet_file(file_path)
        
        # Calculate all indicators (you can add more indicators here)
        df_with_indicators = calculate_indicators(df, indicator, int(window))
        
        # Filter the required indicator
        if indicator in df_with_indicators.columns:
            data = df_with_indicators[['timestamp', indicator]].to_dict(orient='records')
            return jsonify(data)
        else:
            return jsonify({"error": f"Indicator '{indicator}' not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to calculate indicators"}), 500

# Endpoint to get ticker names from parquet files
@app.route('/api/tickers', methods=['GET'])
def get_tickers():
    try:
        # List all files in the specified directory
        files = os.listdir(PARQUET_DIR)
        # Filter for .parquet files and extract ticker names (remove .parquet extension)
        tickers = [os.path.splitext(file)[0] for file in files if file.endswith('.parquet')]
        return jsonify(tickers), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
