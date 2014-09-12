/**
 * Execute on load
 */
$(function() {
    var result = $.url().param('result');
    if (result == '1') {
        $("#alert").addClass('alert-success').text('File uploaded successfully!').show();
    } else if (result == '2') {
        $("#alert").addClass('alert-warning').text('The file provided is not valid!').show();
    } else if (result == '3') {
        $("#alert").addClass('alert-danger').text('There was a problem while parsing the provided file!').show();
    }
});