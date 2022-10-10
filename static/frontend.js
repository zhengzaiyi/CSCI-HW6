function clear_form() {
    document.getElementsByName("Keyword")[0].value="";
    document.getElementsByName("Distance")[0].value="";
    document.getElementsByName("Location")[0].value="";
    document.getElementsByName("Location")[0].disabled=false;
    document.getElementsByName("usegoogle")[0].checked=false;
    document.getElementsByName("Category")[0].options[0].selected=true
    document.getElementsByName("search_table")[0].innerHTML = ''
    document.getElementsByName("details")[0].innerHTML = ''
    document.getElementsByName("details")[0].removeAttribute('id')
}

function click_google() {
    var location = document.getElementsByName("Location")[0]
    var usegoogle = document.getElementsByName("usegoogle")[0]
    if(usegoogle.checked){
        location.value = ""
        location.disabled = true
    } else {
        location.disabled = false
    }
}

function submit_form(){
    var keyword = document.getElementsByName("Keyword")[0]
    var distance = document.getElementsByName("Distance")[0]
    var category = document.getElementsByName("Category")[0]
    var location = document.getElementsByName("Location")[0]
    var lat = ''
    var lng = ''
    if (location.disabled){
        $.getJSON({
            'url': 'https://ipinfo.io/?token=1ce4968d3ff530',
            'async': false,
            'success': function(data) {
                const idx = data['loc'].split(',')
                lat = parseFloat(idx[0]) 
                lng = parseFloat(idx[1])
            }
        })
    } else {
        var addr = {
            'address': location.value,
            'key': 'AIzaSyAKjDcgZdIb98lKnpuW3PKcCAU5Yeu7qBI',
        }
        $.getJSON({
            'url': 'https://maps.googleapis.com/maps/api/geocode/json',
            'async': false,
            'data': addr,
            'success': function(data) {
                var lo = data["results"][0]['geometry']['location']
                lat = lo['lat']
                lng = lo['lng']
            }
        })
    }
    var data = {
        'term': keyword.value,
        'radius': (distance.value * 1609.344).toFixed(2),
        'categories': category.value,
        'latitude': lat,
        'longitude': lng
    }
    $.ajax({
        url: "http://hw6-env.eba-td38xmia.us-west-2.elasticbeanstalk.com/request_search",
        type: "GET",
        data: data,
        success: function(data){
            display_search(data)
        },
    })

}

function display_search(data) {
    var table = document.getElementsByName("search_table")[0]
    document.getElementsByName("details")[0].innerHTML = ''
    document.getElementsByName("details")[0].removeAttribute('id')
    table.innerHTML = "<thead name=\"entries\">\n<tr>\n<th>No.</th><th>Image</th><th class=\"sortth\">Business Name</th><th class=\"sortth\">Rating</th><th class=\"sortth\">Distance (miles)</th>\n</tr>\n</thead>\n<tbody>\n</tbody>"
    var tbody=table.tBodies[0]
    for (var i = 0; i < data['businesses'].length; i++){
        var tr=document.createElement("tr");
        img_href = '<img class="business_pic" src="' + data['businesses'][i]['image_url'] + '">';
		tr.innerHTML = "<td>" + (i + 1) + "</td>"                                       // id
            + "<td>" + img_href + "</td>"                                               // image
            + "<td class=\"business_name\" name=\"" 
            + data['businesses'][i]['id'] + "\" onclick=\"ask_details(this)\">" 
            + '<p id="business_name">' + data['businesses'][i]['name'] + "</p></td>"                                   // name
            + "<td>" + data['businesses'][i]['rating'] + "</td>"                        // rating
            + "<td>" + getMiles(data['businesses'][i]['distance']) + "</td>"            // distance
        tbody.appendChild(tr)
    }
    make_sortable(table);
    window.location.hash = "#search_table"  
}

function ask_details(obj){
    var id = {'id': obj.getAttribute('name')}
    $.ajax({
        url: "http://hw6-env.eba-td38xmia.us-west-2.elasticbeanstalk.com/request_details",
        type: "GET",
        data: id,
        success: function(data){
            display_details(data)
        },
    })
}

function display_details(data){
    details = document.getElementsByName("details")[0]
    details.innerHTML = ''
    var insert = ''

    var title = document.createElement("div")
    title.innerHTML = '<div><h3>' + data['name'] + '</h3><HR></div>'

    var status = document.createElement("div")
    if (data['is_closed']) insert = 'Closed';
    else insert = 'Open Now';
    color = {
        'Open Now': 'green',
        'Closed': 'red'
    }
    status.innerHTML = "<h4>Status</h4> "
    span = document.createElement('span')
    span.setAttribute('id', color[insert])
    span.innerHTML = insert
    status.appendChild(span)

    var category = document.createElement("div")
    insert = ''
    for (var i = 0; i < data['categories'].length; i++) {
        insert += data['categories'][i]['title']
        if (i < data['categories'].length - 1) insert += ' | '
    }
    category.innerHTML = "<h3>Category</h3> "
    + "<p>" + insert + "</p>"

    var address = document.createElement("div")
    insert = ''
    for (var i = 0; i < data['location']['display_address'].length; i++) {
        insert += data['location']['display_address'][i]
        if (i < data['location']['display_address'].length - 1) insert += ' '
    }
    address.innerHTML = "<h4>Address</h4> "
    + "<p>" + insert + "</p>"

    var phone = document.createElement("div")
    phone.innerHTML = "<h4>Phone Number</h4> "
    + "<p>" + data['display_phone'] + "</p>"

    var trans = document.createElement("div")
    insert = ''
    for (var i = 0; i < data['transactions'].length; i++) {
        insert += data['transactions'][i]
        if (i < data['transactions'].length - 1) insert += ' | '
    }
    trans.innerHTML = "<h4>Transactions Supported</h4> "
    + "<p>" + insert + "</p>"

    var price = document.createElement("div")
    price.innerHTML = "<h4>Price</h4> "
    + "<p>" + data['price'] + "</p>"

    var moreinfo = document.createElement("div")
    insert = '<a href="' + data['url'] + '">Yelp</a>'
    moreinfo.innerHTML = "<h4>More info</h4> "
    + "<p>" + insert + "</p><br><br>"

    var placeholder = document.createElement("div")

    var dis_img = document.createElement("div")
    var img1 = document.createElement("div")
    img1.setAttribute('class', 'detail_img')
    img1.setAttribute('id', 'img1')
    img1.innerHTML = '<img src="'+ data['photos'][0] + '">' + '<p>Photo1</p>'

    var img2 = document.createElement("div")
    img2.setAttribute('class', 'detail_img')
    img2.setAttribute('id', 'img2')
    img2.innerHTML = '<img src="'+ data['photos'][1] + '">' + '<p>Photo2</p>'

    var img3 = document.createElement("div")
    img3.setAttribute('class', 'detail_img')
    img3.setAttribute('id', 'img3')
    img3.innerHTML = '<img src="'+ data['photos'][2] + '">' + '<p>Photo3</p>'

    status.setAttribute('class', 'details_item')
    category.setAttribute('class', 'details_item')
    address.setAttribute('class', 'details_item')
    phone.setAttribute('class', 'details_item')
    trans.setAttribute('class', 'details_item')
    price.setAttribute('class', 'details_item')
    moreinfo.setAttribute('class', 'details_item')
    placeholder.setAttribute('class', 'details_item')

    details.setAttribute('id', 'details')
    details.appendChild(title)
    details.appendChild(status)
    details.appendChild(category)
    details.appendChild(address)
    details.appendChild(phone)
    details.appendChild(trans)
    details.appendChild(price)
    details.appendChild(moreinfo)
    details.appendChild(placeholder)
    dis_img.appendChild(img1)
    dis_img.appendChild(img2)
    dis_img.appendChild(img3)
    details.appendChild(dis_img)

    window.location.hash = "#details"
}

function make_sortable(table) {
    var headers=table.getElementsByTagName("th");
    for(var i=2;i<headers.length;i++){
        // skip
        (function(n){
            var flag=false;
            headers[n].onclick = function(){
                var tbody=table.tBodies[0];
                var rows=tbody.getElementsByTagName("tr");
                rows=Array.prototype.slice.call(rows,0);
                rows.sort(function(row1,row2){
                    var cell1=row1.getElementsByTagName("td")[n];
                    var cell2=row2.getElementsByTagName("td")[n];
                    var val1=cell1.textContent||cell1.innerText;
                    var val2=cell2.textContent||cell2.innerText;

                    if(val1<val2){
                        return -1;
                    }else if(val1>val2){
                        return 1;
                    }else{
                        return 0;
                    }
                });
                if(flag){
                    rows.reverse();
                }
                for(var i=0;i<rows.length;i++){
                    rows[i].getElementsByTagName("td")[0].innerHTML = i + 1;
                    tbody.appendChild(rows[i]);
                }

                flag=!flag;
            }
        }(i));
    }
}

function getMiles(meters) {
    return (meters * 0.000621371192).toFixed(2);
}