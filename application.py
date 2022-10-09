from flask import Flask, jsonify, request
from yelpapi import YelpAPI
from flask_cors import CORS

application = Flask(__name__)
CORS(application, resources=r'/*')
yelp_api_key = 'vzyregVWvR0tirtuW4dYVHHsipTo63Xz-Z3JPdi0oGWrYRallgGeIcmua0PlmU09xApul0Eo8HSJuR1itXtxgq5J5fQ47KZrqC_kj-Y6nl8ebyhXZ6v0Sx_NtsE-Y3Yx'
yelp_api = YelpAPI(yelp_api_key)
@application.route('/')
def homepage():
    return application.send_static_file('index.html')

@application.route('/style.css')
def styleFile():
    return application.send_static_file('style.css')

@application.route('/frontend.js')
def jsFile():
    return application.send_static_file('frontend.js')

@application.route('/request_search', methods=['POST', 'GET'])
def search():
    data = dict(request.args)
    if len(data['radius']) > 0:
        data['radius'] = int(float(data['radius']))
    else:
        data['radius'] = None
    result = yelp_api.search_query(**data)
    return jsonify(result)

@application.route('/request_details', methods=['POST', 'GET'])
def details():
    data = dict(request.args)
    result = yelp_api.business_query(data['id'])
    return jsonify(result)
    

if __name__ == '__main__':
    application.run(host='127.0.0.1')