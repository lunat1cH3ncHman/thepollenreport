// main.js
$(document).ready(function() {

    // find the URL of your JSON file on AWS - it'll be in your bucket
    // and look something like https://s3-eu-west-1.amazonaws.com/[bucket name]/pollen.json
    // we load the JSON file using jQuery's AJAX
    $.get("https://s3-eu-west-1.amazonaws.com/thepollenreport/pollen.json")

    // Once we have the data, we parse it to find the pollen count
    .done(function(data) {
        data = JSON.parse(data);
        var pollen = data.count;

        // update the <h1 class="mega"> with the pollen count
        $('.mega').text(pollen);
    })

    // if we couldn't get the data from AWS, display an error message
    .fail(function() {
        $('.mega').text('Unknown');
        $('.main').append('<p>Refresh to try again</p>');
    })

    .always(function() {
        // if you're using a loading gif, this is where you'd hide it
    })
});
