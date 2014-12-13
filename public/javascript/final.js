
$(document).ready(function() {

    var url = 'http://localhost:8080/final';
//    var socket = io.connect(url);

    //modal window helpers
    $('.home').click(function() {
        $(window).bind('beforeunload', function() {
                return "Your answers to the quiz may be lost.";
            });
        window.location.replace('homepage');
    });

    $('.aboutbtn').click(function() {
        $(this).next()[0].click();
    });

    $('.contact').click(function() {
        $(this).next()[0].click();
    });

    // final page's start over
    $('.startOver').click(function() {
        // clean answers
        for (key in answers) {
            answers[key] = {answer: '', answered: false};
        }
        // go back to homepage
         window.location.replace('question');
    });

    // retrieve quiz answers from session storage
    answers = JSON.parse(sessionStorage.getItem('answers'));

    var results = {type: answers.media.answer, mood: '', year: answers.year.answer};
    var mood = {happy: 0, pumped:0, moody:0};

    var dog = answers.dog.answer;
    if (dog == "happyDog") mood.happy++
    else if (dog == "sleepyDog") mood.moody++
    else if (dog == "sillyDog") mood.happy++
    else if (dog == "sadDog") mood.moody++

    var place = answers.place.answer;
    if (place == "boxing") mood.moody++
    else if (place == "concert") mood.pumped++
    else if (place == "beach") mood.happy++
    else if (place == "jogging") mood.pumped++
    else if (place == "picnic") mood.happy++
    else if (place == "cookies") mood.moody++

    var color = answers.color.answer;
    if (color == "yellow") mood.happy++
    else if (color == "blue") mood.moody++
    else if (color == "green") mood.happy++
    else if (color == "red") mood.pumped++

    var sortable = [];
    for (var item in mood)
          sortable.push([item, mood[item]])
    sorted = sortable.sort(function(a, b) {return a[1] - b[1]});

    var winner = sorted[2][0];
    if (sorted[2][1] == 1) winner = "happy";

    results.mood = winner;

    $('body').css("overflow-y", "visible", "important");
    $('body').css("height", "100%", "important");

    var query = url + "/token";
    $.ajax({
        // the URL for the request
        url: query,
        type: "POST",
        cache: false,
        contentType: 'application/json',
        dataType : "json",
        data: JSON.stringify( {results: results }),

        // code to run if the request succeeds;
        // the response is passed to the function
        success: function( json ) {
            console.log( json );
            if (json.type == "music") {
                $('#token').append('<iframe width="560" height="315" src="http:' +
                                   json.src + '" frameborder="0" allowfullscreen></iframe>');
            }
            if (json.type == "photo") {
                $('#token').append('<h5>' + json.title + '<img src=' + json.src + '>');
            }
            if (json.type == "poem") {
                if (json.title == "OCD" || json.title == "Boy Meets World") {
                    $('#token').append('<iframe width="560" height="315" src="http:' +
                                       json.src + '" frameborder="0" allowfullscreen></iframe>');
                }
                else {
                    $('#token').append('<h5>' + json.title + ' by ' + json.author + '</h5>' + json.src);
                }
            }
        },

        // code to run if the request fails; the raw request and
        // status codes are passed to the function
        error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
            console.log( xhr.statusText );
        }
    });
});

