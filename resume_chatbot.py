import os
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from llama_index.core import GPTVectorStoreIndex, SimpleDirectoryReader

# Load environment variables
load_dotenv()
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')

# Initialize Flask app
app = Flask(__name__, static_folder="static", template_folder="templates")

# Load documents and create index
documents = SimpleDirectoryReader("data").load_data()
index = GPTVectorStoreIndex.from_documents(documents, show_progress=True)
query_engine = index.as_query_engine()

# Serve the main page
@app.route("/")
def home():
    return render_template("index.html")

# Handle chatbot queries
@app.route("/query", methods=["POST"])
def query_resume():
    user_query = request.json.get("query", "")
    if not user_query:
        return jsonify({"error": "Query is required"}), 400

    response = query_engine.query(user_query)
    return jsonify({"response": str(response)})

if __name__ == "__main__":
    app.run(debug=True)