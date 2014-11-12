
$(document).ready(function() {
    //modal window helpers
    $('#home').click(function(event) {
            $(window).bind('beforeunload', function(){
                return "Are you sure you want to leave? Your answers to the quiz may be lost.";
                });
            window.location.replace('index.html');
        });

    $('#about').click(function(event) {
            $(this).next()[0].click();
        });

    $('#contact').click(function(event) {
            $(this).next()[0].click();
        });


    //start with homepage
     $('.start').click(function(event) {
             window.location.replace('question.html');
        });


    // initialize app
    var $form = $('form');
    var questions = ['media', 'color', 'place', 'dog', 'year'];

    // remember answers using answer obj:
    var answers = {};

    questions.forEach(function(key) {
        answers[key] = {};
    });

    for (key in answers) {
        answers[key] = {answer: '', answered: false};
    }


    /*
     * Initializes the app, and adds event listeners
     */
    function init() {
        // handle form submition
        $form = $('form');
        $form.submit(function(event) {
            formSubmit(event);
        });
        // handle selection: user can select testareas or imgs, depending on form
        // for textareas
        $('.textAnswer').click(function(event) {
            selectBtn(event);
        });
        // for images
        $('img').click(function(event) {
            selectImg(event);
        });
    }

    /*
     * Saves selected answer
     * Parameters:
     *  1. question answered (string)
     *  2. answer (string)
     */
    function saveAnswer(key, answerValue) {
        answers[key].answer = answerValue;
        answers[key].answered = true;
        // for css styling, add class values here
    }

    /*
     * Loads a question, using jQuery's ajax .load() method.
     * Parameter: reference to question to load
     *
     * todo later: smooth transitions between questions using slider
     */
    function loadQuestion(page, index) {
        // chnage nav buttons color
        $nav_button = $('.nav_btn').eq(index)
        $nav_button.addClass('past_nav_btn');

        // interactive question requires diferent handling
        if (page === 'place') {
            $('#questions_container').load('questions.html #' + answers.color.answer + '_' + page, init);
        } else { // generic handling
            $('#questions_container').load('questions.html #' + page, init);
        }
    }

    /*
    * Enable nav button navigation
    */
    $('.nav_btn').click(function(event) {
             window.location.replace('question.html');
        });

    /* Handles form submission */
    function formSubmit(event) {
        event.preventDefault();
        // get question's name
        var question = $form.parent().attr('id');
        if (question.indexOf('_') !== -1) { // if it contains an underscore
            // then the question's name is what appears after the _
            question = question.split('_')[1];
        }
        // get selected radio btn (= answer)
        var selectedAnswer = $form.find(':checked').val();
        // save answer
        saveAnswer(question, selectedAnswer);
        // load next question
        var currentIndex = questions.indexOf(question);
        if (currentIndex < 4) { // if not last question
            loadQuestion(questions[currentIndex + 1], currentIndex);
        } else {
            // load final page
            window.location.replace('final.html');
        }
    }

    /* Handles selection of textAreas */
    function selectBtn(event) {
        var $selected = $(event.target);
        // remove highlights (of all bts)
        $selected.parent().parent().find('.textAnswer').each(function() {
            $(this).removeClass('selected_btn');
            $(this).prev().attr('checked', false);
        });
        // highlight selected - add class: selected_btn if btn
        $selected.addClass('selected_btn');
        // check radio btn
        $selected.prev().attr('checked', true);
        // add continue button
        $('.continue').css("display", "block", "important");
    }

    /* Handles selection of imgs */
    function selectImg(event) {
        var $selected = $(event.target);
        // remove highlights (of all imgs)
        $selected.parent().parent().find('img').each(function() {
            $(this).removeClass('selected_img');
            $(this).prev().attr('checked', false);
        });
        // highlight selected - add class: selected_img
        $selected.addClass('selected_img');
        // check radio btn
        $selected.prev().attr('checked', true);
        // add continue button
        $('.continue').css("display", "block", "important");
    }

    init();


    // add event listeners on keys to allow to navigate between questions

});
