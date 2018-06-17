$(document).ready(function() {
    $(".nav-tabs a").click(function() {
        $(this).tab('show');
    });

    $('#menu1-search').click(function() {
        var data = {};
        data.title = "title";
        data.message = "message";
        var userId = $("#user-input").val();

        $.ajax({
            type: 'GET',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:3000/analyze/search_user?userId='+userId,
            success: function(raw) {
                respData = JSON.parse(raw)
                console.log(JSON.stringify(respData));
                $('#menu1-item-result').empty();
                for (index in respData.items) {
                    $('#menu1-item-result').append(
                        $('<li>').attr('class', 'list-group-item').append(respData.items[index]),
                    );
                };
            },
        });
    });
});