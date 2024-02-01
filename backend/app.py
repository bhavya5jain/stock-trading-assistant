import os
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS

os.environ['OPENAI_API_KEY'] = ''

app = Flask(__name__)
# Allow all domains to access resources
CORS(app)


@app.route('/health', methods=['GET'])
def health_check():
    return 'OK'


@app.route('/stock_info', methods=['GET', 'POST'])
def stock_suggestion():

    stock_name = request.args.get('stock_name')
    capital = request.args.get('capital')
    risk = request.args.get('risk')
    time_frame = request.args.get('time_frame')

    historical_stock_data = request.get_data(as_text=True)

    chatPrompt = f"Imagine you are an assistant financial advisor specializing in stock performance analysis. Your client, who has a {risk} tolerance and prefers {time_frame} term investments, is seeking advice based on the following information: - Investment amount: {capital} - Risk tolerance: {risk} - Preferred investment duration: {time_frame}. Please provide an in depth analysis about {stock_name} with given data:{historical_stock_data}"

    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": chatPrompt}
        ]
    )

    # Process the response and send it back to the frontend
    result = response.choices[0].message.content

    return jsonify({'result': result})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
