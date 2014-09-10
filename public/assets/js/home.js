
$(function() {
    $(".toggleButton").on("click", function(e) {
        e.preventDefault();
        $(".toggleButton").removeAttr("disabled");
        $(this).attr("disabled", true);
    });

    var socket = io.connect(document.location.host);

    // Every time there is a new tweet
    socket.on("server:tweet", function(tweet){
        console.log(tweet);
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