from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

products = []
current_id = 1

@app.route("/products", methods=["POST"])
def add_product():
    global current_id
    data = request.get_json(force=True)

    if not data or not data.get("name") or data.get("price") is None or data.get("quantity") is None:
        return jsonify({"error": "All fields (name, price, quantity) are required"}), 400

    product = {
        "id": current_id,
        "name": data["name"],
        "price": data["price"],
        "quantity": data["quantity"]
    }

    products.append(product)
    current_id += 1
    return jsonify(product), 201

@app.route("/products", methods=["GET"])
def get_products():
    return jsonify(products), 200

@app.route("/products/<int:pid>", methods=["PUT"])
def update_product(pid):
    data = request.get_json(force=True)

    for p in products:
        if p["id"] == pid:
            p["name"] = data.get("name", p["name"])
            p["price"] = data.get("price", p["price"])
            p["quantity"] = data.get("quantity", p["quantity"])
            return jsonify(p), 200

    return jsonify({"error": "Product not found"}), 404

@app.route("/products/<int:pid>", methods=["DELETE"])
def delete_product(pid):
    global products
    products = [p for p in products if p["id"] != pid]
    return jsonify({"message": "Product deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)
