from flask import Flask, jsonify, request
from yelpapi import YelpAPI
from flask_cors import CORS

application = Flask(__name__)
CORS(application, resources=r'/*')
yelp_api_key = 'vzyregVWvR0tirtuW4dYVHHsipTo63Xz-Z3JPdi0oGWrYRallgGeIcmua0PlmU09xApul0Eo8HSJuR1itXtxgq5J5fQ47KZrqC_kj-Y6nl8ebyhXZ6v0Sx_NtsE-Y3Yx'
yelp_api = YelpAPI(yelp_api_key)
@application.route('/')
def home():
    return application.send_static_file('index.html')

@application.route('/styles.8c8250e859b068b9.css')
def style():
    return application.send_static_file('styles.8c8250e859b068b9.css')

@application.route('/3rdpartylicenses.txt')
def style1():
    return application.send_static_file('3rdpartylicenses.txt')

@application.route('/favicon.ico')
def style2():
    return application.send_static_file('favicon.ico')

@application.route('/main.e53a8a25828f7405.js')
def style3():
    return application.send_static_file('main.e53a8a25828f7405.js')

@application.route('/polyfills.163a4f50bd3dde8d.js')
def style4():
    return application.send_static_file('polyfills.163a4f50bd3dde8d.js')

@application.route('/runtime.0f7e59e5c7a0fe54.js')
def style5():
    return application.send_static_file('runtime.0f7e59e5c7a0fe54.js')

@application.route('/assets')
def style6():
    return application.send_static_file('./assets/structure.ts')

@application.route('/frontend.js')
def js():
    return application.send_static_file('frontend.js')

@application.route('/request_search', methods=['POST', 'GET'])
def search():
    data = dict(request.args)
    data['limit'] = 10
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

@application.route('/request_reviews', methods=['POST', 'GET'])
def reviews():
    data = dict(request.args)
    result = yelp_api.reviews_query(data['id'])
    return result
@application.route('/request_autocomplete', methods=['POST', 'GET'])
def auto():
    data = dict(request.args)
    result = yelp_api.autocomplete_query(text=data['keyword'])
    return result

if __name__ == '__main__':
    application.run(host='127.0.0.1')
