//javascript file
// This is jquery's way of saying document.addEventListener("DOMContentLoaded", function(){})
// See http://learn.jquery.com/using-jquery-core/document-ready/ for more description
$(document).ready(function() {
    var answers = {};


//    $("input:radio[name=answer]").on("click", function () {
//    if ($("input:radio[name=answer]").is(":checked")) {
//        $(this).css( "color", "red" );
//        $( ".continue" ).show();
//    }
//    });

//    if ($("input:radio[name=answer]").is(":checked")) {
//        $(this).css( "color", "red" );
//        $( ".continue" ).show();
//    }

    $( ".textAnswer" ).click( function( event ) {
        $(this).css( "color", "red" );
        $( ".continue" ).show();
    });[444444


    $( "form" ).submit(function( event ) {
        event.preventDefault();
        alert($('input[name=answer]').val());
        answers.push($('input[name=answer]').val());


    });
});
