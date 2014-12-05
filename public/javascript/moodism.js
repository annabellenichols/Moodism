
$(document).ready(function() {
    //modal window helpers
    $('.home').click(function() {
        $(window).bind('beforeunload', function() {
                return "Are you sure you want to leave? Your answers to the quiz may be lost.";
            });
        window.location.replace('index.html');
    });

    $('.aboutbtn').click(function() {
        $(this).next()[0].click();
    });

    $('.contact').click(function() {
        $(this).next()[0].click();
    });

    // start with homepage
     $('.start').click(function() {
         window.location.replace('question.html');
    });

    // final page's start over
    $('.startOver').click(function() {
        // clean answers
        for (key in answers) {
            answers[key] = {answer: '', answered: false};
        }
        // go back to homepage
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
     * Initializes the app, and add event listeners
     */
    function init() {
        // handle form submition
        $form = $('form');
        $form.off(); // prevent against multiple event handlers for the same event
        $form.submit(function(event) {
            formSubmit(event);
        });
        // enable nav_btn navigation
        $('.nav_btn').off().click(function(event) {
             navigate(event);
        });
        // handle selection: user can select testareas or imgs, depending on form
        // for textareas
        $('.textAnswer').off().click(function(event) {
            selectBtn(event);
        });
        // for images
        $('img').off().click(function(event) {
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
    }

    /* Returns current question's name */
    function getQuestion() {
        var question = $form.parent().attr('id');
        if (question.indexOf('_') !== -1) { // if it contains an underscore
            // then the question's name is what appears after the _
            question = question.split('_')[1];
        }
        return question;
    }

    /*
     * Highlights the previous answer chosen for the question, if it was answered previously
     * Parameters: name of question (string)
     */
    function getAnswer(page) {
        // check if question was answered
        if (answers[page].answered) {
            var previousAnswer = answers[page].answer;
            // check if answer exists (i.e. not null or undefined)
            if (previousAnswer) {
                // get previous answer element
                var $answerRadio = $form.find('input[value="' + previousAnswer + '"]');
                // find out if answer element is an image or a btn
                var $answerEl = $answerRadio.next();
                if ($answerEl.is('img')) { // if img
                    // highlight selected - add class: selected_img
                    $answerEl.addClass('selected_img');
                } else { // it's a btn
                    // highlight selected - add class: selected_btn if btn
                    $answerEl.addClass('selected_btn');
                }

                // check radio btn
                $answerRadio.attr('checked', true);
                // add continue button
                $('.continue').css("display", "block", "important");
            }
        }
    }

    /*
     * Loads a question, using jQuery's ajax .load() method.
     * Parameters: name of question to load (string)
     */
    function loadQuestion(page) {
        // change nav buttons color
        $nav_button = $('.nav_btn[data-questionref=' + page + ']');
        $nav_button.addClass('past_nav_btn');

        // ckeck if "you are here" arrow exists
        if( $('.arrow').length ) {
            $('.arrow').css("display", "none", "important"); // if so, remove it
        }

        // change pages using animation
        slide(page);
    }

    /* Animates transitions between questions using a slider */
    function slide(newQuestion) {
        if (newQuestion == getQuestion()) {
            // do nothing, because the new question is already the one shown
            return;
        }

        // check if the new question comes before or after the current one, and animate accordingly
        var slideDirection = '-';
        if (questions.indexOf(newQuestion) < questions.indexOf(getQuestion())) {
            // if new question comes before, slide from bottom to top
            slideDirection = '';
        }

        var $questionContainer = $('#questions_container');

        // check no animation is already running
        if($questionContainer.is(':animated')) {
            return;
        }


        // get question's container's width, height, and distance from left side of broser window
        var containerHeight = $questionContainer.height();
        var containerWidth = $questionContainer.width() - 20; // -20px due to padding and margins
        var leftDistance = $questionContainer.offset().left - 65; // -65px due to having removed 20 before

        // create temp container for next question and hide it
        var $tempContainer = $('<div class="grid_8" id="tempContainer">').css(
            {height: containerHeight,
             width: ((containerWidth * 100) / $('window').width()), // convert to percentage
             display: 'none'}
        );
        $('#main').append($tempContainer);

        // add temp container after main container
        $tempContainer.css({position: 'relative', top: '100%', left: leftDistance, display: 'block', opacity: 0});

        // change question's container's position to relative in order for the animation to work
        $questionContainer.css({position: 'relative'});

        // load new question
        // interactive question requires diferent handling
        if (newQuestion === 'place') {
           $tempContainer.load('questions.html #' + answers.color.answer + '_' + newQuestion, function(){ // on content loaded
                // animate slide
                $questionContainer.animate({
                    top: slideDirection + containerHeight + 'px',
                    opacity: 0
                }, {queue: false,
                    done: function(){ // on animation's (successful) completion
                              slideDone($questionContainer, $tempContainer);
                          }
                   });
            });
        } else { // generic handling
            $tempContainer.load('questions.html #' + newQuestion, function(){ // on content loaded
                // animate slide
                $questionContainer.animate({
                    top: slideDirection + containerHeight + 'px',
                    opacity: 0
                }, {queue: false,
                    done: function(){ // on animation's (successful) completion
                              slideDone($questionContainer, $tempContainer);
                          }
                   });
            });
        }
    }

    /* Cleans the page after the animation has run */
    function slideDone($questionContainer, $tempContainer) {
        // set new container before nav btn
        $questionContainer.after($tempContainer.detach());
        // since $tempContainer was removed from the page, we must redo the refence to it (jQuery object)
        $tempContainer = $('#tempContainer');
        // set position of new item
        $tempContainer.css({top: 0, left: 0, opacity: 100});
        // remove main container and make temp container new main container
        $questionContainer.remove();
        $tempContainer.attr('id', 'questions_container');

        // reset event listeners
        init();

        // if going to previous questions, highlight previous answer and keep continue btn on
        getAnswer(getQuestion());
    }

    /* Enable nav button navigation */
    function navigate(event) {
        // use data attribute to identify btn
        var destination = $(event.target).data('questionref');
        // check answer to check if the question was already answered
        if (answers[destination].answered) {
            // remember current question so user can come back later
            answers[getQuestion()].answered = true;
            // navigate
            loadQuestion(destination);
        } // else do nothing
    }

    /* Handles form submission */
    function formSubmit(event) {
        event.preventDefault();
        // get question's name
        var question = getQuestion();
        // get selected radio btn (= answer)
        var selectedAnswer = $form.find(':checked').val();
        // save answer
        saveAnswer(question, selectedAnswer);
        // load next question
        var currentIndex = questions.indexOf(question);
        if (currentIndex < 4) { // if not last question
            loadQuestion(questions[currentIndex + 1]);
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

    /* Handles "scrolling" to next question */
    function scrollNext() {
        // check if next question has been answered
        var nextQuestion = questions[questions.indexOf(getQuestion()) + 1];
        if (answers[nextQuestion].answered) {
            // navigate to the next question
            loadQuestion(nextQuestion);
        }
    }

    /* Handles "scrolling" to previous question */
    function scrollPrevious() {
        // else if left or bottom arrow, navigate to previous question
        var prevQuestionIndex = questions.indexOf(getQuestion()) - 1;
        // if there is no previous question, do nothing
        if (prevQuestionIndex < 0) {
            return;
        }
        // remember current question so user can come back later
        answers[getQuestion()].answered = true;
        // go to previous question
        loadQuestion(questions[prevQuestionIndex]);
    }

    // initiate app and add update 1st nav btn, to indicate to the user he/she's already in the 1st question
    init();
    $('.nav_btn').eq(0).addClass('past_nav_btn');

    // add event listeners on keys to allow to navigate between questions
    $(document).on('keydown', function(event) {
        // if it was right or top arrow
        if (event.keyCode == 40 || event.keyCode == 39) {
            scrollNext();
        } else if (event.keyCode == 37 || event.keyCode == 38) {
            scrollPrevious();
        }
        // else do nothing
    });

    // add event listeners on mouse wheel to allow to navigate between questions (via scrolling)
    $(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
        scrollNext();
    }
    else {
        scrollPrevious();
    }


});

    // TODO:
    // session storage for answers (use for final screen)

});

