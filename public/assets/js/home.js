/**
 *
 * @param status
 */
var applyStatus = function(status) {
    $("#keywords").val(status.keywords);
    $(".toggleButton").attr("disabled", true);
    if (status.running) {
        $("#stopButton").removeAttr("disabled");
        $("i.fa-cog").addClass("fa-spin");
    } else {
        $("#startButton").removeAttr("disabled");
        $("i.fa-cog").removeClass("fa-spin");
    }
};

/**
 * Execute on load
 */
$(function() {
    // Enable websocket connection
    var socket = io.connect(document.location.host);

    // Initialize status
    socket.emit("client:status-report", function(status) {
        console.log(status);
        applyStatus(status);
    });

    // Every time there is a new tweet
    socket.on("server:tweet", function(tweet){
        console.log(JSON.parse(tweet));
    });

    $(".toggleButton").on("click", function(e) {
        e.preventDefault();
        $(".toggleButton").removeAttr("disabled");
        $(this).attr("disabled", true);
    });

    // Every time someone changes the status
    socket.on("server:status-update", function(status){
        console.log(status);
        applyStatus(status);
    });

    $("#startButton").on("click", function(e) {
        e.preventDefault();
        if ($("#keywords").val()){
            $("i.fa-cog").addClass("fa-spin");
            socket.emit("client:start", $("#keywords").val());
        } else {
            $("#stopButton").click();
        }

    });

    $("#stopButton").on("click", function(e) {
        e.preventDefault();
        socket.emit("client:stop", $("#keywords").val());
        $("i.fa-cog").removeClass("fa-spin");
    });

});