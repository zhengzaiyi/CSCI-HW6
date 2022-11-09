export interface ResultItem {
    'id': string,
    'alias': string,
    'categories': [{
        'alias': string,
        'title': string
    }],
    'rating': number,
    'name': string,
    'image_url': string,
    'distance': number,
    'display_phone': string,
    'url': string,
    'price': string,
    'location': {
        'display_address': [string]
    },
    'is_closed': boolean,
    'coordinates': {
        'latitude': number, 
        'longitude': number
    }
}