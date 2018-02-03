var express = require('express');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var fs  = require('fs');
var app = express();
var port = 8000;

//var url = 'https://restaurant.michelin.fr/2abl39j/le-chiberta-paris-08';
//var url = 'https://restaurant.michelin.fr/2a7edmf/le-grand-vefour-paris-01';
var url = 'https://restaurant.michelin.fr/2af46v7/le-pre-catelan-paris-16';

/*
request(url, function (error, response, html) {
    if(error){
        console.log(error);
    } else if ( response.statusCode != 200) {
        console.log(response.statusCode);
    } else {
        var $ = cheerio.load(html);

        var restaurantName = $('h1');
        restaurantName = restaurantName.first();
        //console.log(restaurantName.text());

        var street = $('.thoroughfare');
        console.log(street.length);
        street = street.first();
        //console.log(street.text());

        var postalCode = $('.postal-code');
        postalCode = postalCode.first();
        //console.log(postalCode.text());

        var locality = $('.locality');
        locality = locality.first();
        //console.log(locality.text());

        //var grade = $('span.opt-upper-var2__rating');
        //grade = grade.first();
        //console.log(grade.html());

        var stars = 0;
        var i = 1;
        var numberOfStars = 0;
        while( (stars.length == null || stars.length == 0) && i < 4){
            if(i == 1){
                stars = $('.guide .icon-cotation1etoile ');
                if(stars.length > 0){
                    numberOfStars = 1;
                }
            }
            if(i == 2){
                stars = $('.guide .icon-cotation2etoiles ');
                if(stars.length > 0){
                    numberOfStars = 2;
                }
            }
            if(i == 3){
                stars = $('.guide .icon-cotation3etoiles ');
                if(stars.length > 0){
                    numberOfStars = 3;
                }
            }
            i++;
        }

        var restaurant = {
            name: restaurantName.text(),
            stars: numberOfStars,
            street: street.text(),
            postalCode : postalCode.text(),
            locality: locality.text()
        }

        console.log(restaurant);
    }

})
*/



/*
var url = 'https://restaurant.michelin.fr/search-restaurants?stars=1||2||3&page_number=1';
request(url, function (error, response, html) {
    if(error){
        console.log(error);
    } else if ( response.statusCode != 200) {
        console.log(response.statusCode);
    } else {
        json_object = JSON.parse(html);
        var $ = cheerio.load(json_object[3].data.search_result);
        var links = $('.poi-card-link');
        links.each(function( index ) {
            console.log( index + ": " + $( this ).attr( 'href' ) );
        });

        var numberOfPages = 0;
        var numbers = $('.mr-pager-link');
        numbers.each(function( index ) {
            if(parseInt( $( this ).attr( 'attr-page-number' ) ) > numberOfPages){
                numberOfPages = $( this ).attr( 'attr-page-number' );
            }
            console.log( index + ": " + $( this ).attr( 'attr-page-number' ) );
        });
        console.log("Number of pages : " + numberOfPages);
    }

})
*/


//console.log("GET : " + get());

async function get() {
    await getAllRestaurants()
        .then(function(result) { // returns a promise
            //console.log(result);
            data = JSON.stringify(result);
            //fs.writeFileSync('restaurants.json', data);
            resolve(result);
        })
        .catch(function(result) {
            // Or do something else if it is rejected
            // (it would not happen in this example, since `reject` is not called).
        });
}


function delay(time) {
    // `delay` returns a promise
    return new Promise(function(resolve, reject) {
        // Only `delay` is able to resolve or reject the promise
        setTimeout(function() {
            resolve(true); // After 60 seconds, resolve the promise with value true
        }, 10000);
    });
}

function getAllRestaurants(){
    return new Promise(function(resolve, reject) {
        var all_restaurants = [];
        var numberOfPages;
        getNumberOfPages()
            .then(function(result) { // returns a promise
                //console.log("RES : " + result); // Log the value once it is resolved
                numberOfPages = 1;//result;
                getAllRestaurantsURL(numberOfPages)
                    .then(function(result) { // returns a promise
                        var restaurants_url = result;
                        //console.log("RETOUR : " + restaurants_url);

                        var i;
                        for (i = 0; i < restaurants_url.length; i++) {
                            getRestaurant(restaurants_url[i])
                                .then(function(result) { // returns a promise
                                    all_restaurants = all_restaurants.concat( result );
                                    console.log('Number of restaurants : ' + all_restaurants.length);
                                })
                                .catch(function(result) {
                                    // Or do something else if it is rejected
                                    // (it would not happen in this example, since `reject` is not called).
                                });
                        }

                        delay(10*60*1000)
                            .then(function(v) { // `delay` returns a promise
                                console.log("DONE : GETTING ALL RESTAURANTS.");
                                resolve(all_restaurants);
                            })
                            .catch(function(v) {
                                // Or do something else if it is rejected
                                // (it would not happen in this example, since `reject` is not called).
                            });

                    })
                    .catch(function(result) {
                        // Or do something else if it is rejected
                        // (it would not happen in this example, since `reject` is not called).
                    });
            })
            .catch(function(result) {
                // Or do something else if it is rejected
                // (it would not happen in this example, since `reject` is not called).
            });
    });
}

function getRestaurant(url) {
    return new Promise(function(resolve, reject) {
        var restaurant = null;
        request(url, function (error, response, html) {
            if(error){
                console.log(error);
            } else if ( response.statusCode != 200) {
                console.log(response.statusCode);
            } else {
                var $ = cheerio.load(html);

                var restaurantName = $('h1');
                restaurantName = restaurantName.first();
                //console.log(restaurantName.text());

                var street = $('.thoroughfare');
                console.log(street.length);
                street = street.first();
                //console.log(street.text());

                var postalCode = $('.postal-code');
                postalCode = postalCode.first();
                //console.log(postalCode.text());

                var locality = $('.locality');
                locality = locality.first();
                //console.log(locality.text());

                var stars = 0;
                var i = 1;
                var numberOfStars = 0;
                while( (stars.length == null || stars.length == 0) && i < 4){
                    if(i == 1){
                        stars = $('.guide .icon-cotation1etoile ');
                        if(stars.length > 0){
                            numberOfStars = 1;
                        }
                    }
                    if(i == 2){
                        stars = $('.guide .icon-cotation2etoiles ');
                        if(stars.length > 0){
                            numberOfStars = 2;
                        }
                    }
                    if(i == 3){
                        stars = $('.guide .icon-cotation3etoiles ');
                        if(stars.length > 0){
                            numberOfStars = 3;
                        }
                    }
                    i++;
                }

                restaurant = {
                    name: restaurantName.text(),
                    stars: numberOfStars,
                    street: street.text(),
                    postalCode : postalCode.text(),
                    locality: locality.text()
                }

                resolve(restaurant);
            }
        })
    });
}

function getAllRestaurantsURL(numberOfPages) {
    return new Promise(function(resolve, reject) {
        var restaurants_url = [];
        var i;
        for (i = 0; i < numberOfPages; i++) {
            getRestaurantsURL(i+1)
                .then(function(result) { // returns a promise
                    //console.log("RES : " + result); // Log the value once it is resolved
                    restaurants_url = restaurants_url.concat( result );
                })
                .catch(function(result) {
                    // Or do something else if it is rejected
                    // (it would not happen in this example, since `reject` is not called).
                });
        }
        console.log("ALL REQUEST LAUNCHED.");

        delay(60*1000)
            .then(function(v) { // `delay` returns a promise
                console.log("DONE : GETTING ALL URL.");
                //console.log(restaurants_url);
                resolve(restaurants_url);
            })
            .catch(function(v) {
                // Or do something else if it is rejected
                // (it would not happen in this example, since `reject` is not called).
            });
    });
}

function getRestaurantsURL(pageNumber) {
    return new Promise(function(resolve, reject) {
        console.log("Getting restaurants URL at page #" + pageNumber + " .");
        var url = 'https://restaurant.michelin.fr/search-restaurants?stars=1||2||3&page_number=' + pageNumber;
        var list_of_url = [];
        request(url, function (error, response, html) {
            if(error){
                console.log(error);
            } else if ( response.statusCode != 200) {
                console.log(response.statusCode);
            } else {
                json_object = JSON.parse(html);
                var $ = cheerio.load(json_object[3].data.search_result);
                var links = $('.poi-card-link');
                links.each(function( index ) {
                    //console.log( index + ": " + $( this ).attr( 'href' ) );
                    list_of_url.push('https://restaurant.michelin.fr' + $( this ).attr( 'href' ));
                });
                console.log("DONE : getting restaurants URL at page #" + pageNumber + " .");
                resolve(list_of_url);
            }
        })
    });
}

function getNumberOfPages() {
    return new Promise(function(resolve, reject) {
        var url = 'https://restaurant.michelin.fr/search-restaurants?stars=1||2||3&page_number=1';
        var numberOfPages = 0;
        request(url, function (error, response, html) {
            if(error){
                console.log(error);
            } else if ( response.statusCode != 200) {
                console.log(response.statusCode);
            } else {
                json_object = JSON.parse(html);
                var $ = cheerio.load(json_object[3].data.search_result);
                var numbers = $('.mr-pager-link');
                numbers.each(function( index ) {
                    if(parseInt( $( this ).attr( 'attr-page-number' ) ) > numberOfPages){
                        numberOfPages = parseInt( $( this ).attr( 'attr-page-number' ) );
                    }
                    //console.log( index + ": " + $( this ).attr( 'attr-page-number' ) );
                });
                //console.log("Number of pages : " + numberOfPages);
                resolve(numberOfPages);
            }
        })
    });
}

app.listen(port);
console.log("server is listening on port " + port);