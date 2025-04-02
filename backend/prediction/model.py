import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load the model
model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl') 

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["description"]
    processed_text = vectorizer.transform([data])
    pred = model.predict(processed_text)[0]
    return jsonify({"prediction": pred})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)