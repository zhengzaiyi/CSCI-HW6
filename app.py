from flask import Flask, jsonify, request
from yelpapi import YelpAPI
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources=r'/*')
yelp_api_key = 'vzyregVWvR0tirtuW4dYVHHsipTo63Xz-Z3JPdi0oGWrYRallgGeIcmua0PlmU09xApul0Eo8HSJuR1itXtxgq5J5fQ47KZrqC_kj-Y6nl8ebyhXZ6v0Sx_NtsE-Y3Yx'
yelp_api = YelpAPI(yelp_api_key)
@app.route('/')
def homepage():
    return app.send_static_file('index.html')

@app.route('/style.css')
def styleFile():
    return app.send_static_file('style.css')

@app.route('/frontend.js')
def jsFile():
    return app.send_static_file('frontend.js')

@app.route('/request_search', methods=['POST', 'GET'])
def search():
    data = dict(request.args)
    if len(data['radius']) > 0:
        data['radius'] = int(float(data['radius']))
    else:
        data['radius'] = None
    result = yelp_api.search_query(**data)
    return jsonify(result)

@app.route('/request_details', methods=['POST', 'GET'])
def details():
    data = dict(request.args)
    result = yelp_api.business_query(data['id'])
    return jsonify(result)
    

if __name__ == '__main__':
    app.run(host='127.0.0.1')