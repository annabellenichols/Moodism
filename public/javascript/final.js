
$(document).ready(function() {

    var url = 'https://localhost:8080/final';
    var socket = io.connect(url);

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

    var results = {media: answers.media.answer, mood: '', time: answers.year.answer};
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

    socket.emit('downloadToken',{
			'results': results
    });

    socket.on('displayToken', function (data) {
        alert("hello");
		alert(data);
	});
});

