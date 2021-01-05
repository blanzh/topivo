function loadJSON(url, cFunction) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                cFunction(this);
            } else {
                if (this.status === 401) {
                    // alert("Ошибка доступа")
                }
            }

        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function star(index, rating) {
    var val = 'r1'
    var minus = rating - index
    if (minus < 0 && minus > -1) {
        val = 'r0_5'
    } else if (minus <= -1) {
        val = 'r0'
    }
    return val
}

var token = getParameterByName('t')
var venue_id = getParameterByName('v')
var x = getParameterByName('x') || 6
var y = getParameterByName('y') || 4
var popup = getParameterByName('p') || false

var items_count = x * y
var html = ''

for (var i = 0; i < items_count; i++) {
    html += '<div class="item" style="background-image: url(nophoto.png); ' +
        'width:' + 100 / x + '%;' +
        'height: ' + 100 / y + '%">' +
        '<div class="beer_name"></div>' +
        '<div class="user_name"></div>' +
        '<div class="rating">' +
        '<div class="star"></div>' +
        '<div class="star"></div>' +
        '<div class="star"></div>' +
        '<div class="star"></div>' +
        '<div class="star"></div>' +
        '</div>' +
        '</div>'
}
document.getElementById('wrap').innerHTML = html
var items = document.querySelectorAll('.item')

function getPhotos() {
    loadJSON("https://api.untappd.com/v4/venue/checkins/" + venue_id
        + "?access_token=" + token + "&cache=" + new Date().getTime(), function (data) {

        var json = JSON.parse(data.responseText)
        var checkins = json.response.checkins.items

        for (var k = 0; k < items_count; k++) {
            var item = checkins[k]

            var photo = 'nophoto.png'
            if (item.media.count >= 1) {
                photo = item.media.items[0].photo.photo_img_lg || item.media.items[0].photo.photo_img_md
            }
            var beer_name = item.beer.beer_name
            var user_name = item.user.user_name
            var rating = item.rating_score

            items[k].style.backgroundImage = 'url(' + photo + ')';
            items[k].querySelector('.beer_name').innerHTML = beer_name
            items[k].querySelector('.user_name').innerHTML = '@' + user_name
            console.log(rating, beer_name);
            if (rating) {
                var stars = items[k].querySelectorAll('.rating .star')
                for (var r = 0; r < 5; r++) {
                    stars[r].className = 'star ' + star(r + 1, rating)
                }
            }
        }
    })
}

if (token && venue_id) {
    getPhotos()
    setInterval(function () {
        getPhotos()
    }, 60000)
}

