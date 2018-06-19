$(document).ready(function() {
    $("#success-alert").hide();
    $("#danger-alert").hide();
    $("#info-alert").hide();

    $(".nav-tabs a").click(function() {
        $(this).tab('show');
    });

    $("#file-input").on(
        'change',
        function() {
            var $input = $('#file-input');
            var files = $input.prop('files');
            if (files.length < 1) {
                return
            }
            var data = new FormData();
            data.append('files', files[0]);
            console.log(files);
            $.ajax({
                url: '/analyze/upload',
                type: 'POST',
                data: data,
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: function() {
                    $("#info-alert").empty();
                    $("#info-alert").append('正在上传').show();
                },
                success: function(raw) {
                    console.log('ok');
                    $("#info-alert").fadeOut();
                    $("#success-alert").empty();
                    $("#success-alert").append('录入成功').show().delay(2000).fadeOut();
                },
                error: function(raw) {
                    $("#info-alert").fadeOut();
                    $("#danger-alert").empty();
                    $("#danger-alert").append('出错了 ' + raw.responseText).show().delay(10000).fadeOut();
                },
            });
        },
    );

    $('#menu1-search').click(function() {
        var data = {};
        var userId = $("#user-input").val();

        $.ajax({
            type: 'GET',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/endpoint/search_user?userId=' + userId,
            beforeSend: function() {
                $("#info-alert").empty();
                $("#info-alert").append('正在查询').show();
            },
            success: function(raw) {
                $("#info-alert").delay(1000).fadeOut();
                respData = JSON.parse(raw)
                console.log(JSON.stringify(respData));
                $('#menu1-item-result').empty();
                if (respData.items && respData.items.length > 0) {
                    $('#menu1-item-result').append($('<li>').attr('class', 'list-group-item')
                        .append('共找到推荐商品' + respData.items.length + '项'));
                } else {
                    $('#menu1-item-result').append($('<li>').attr('class', 'list-group-item')
                        .append('共找到推荐商品0项'));
                }

                for (index in respData.items) {
                    $('#menu1-item-result').append(
                        $('<li>').attr('class', 'list-group-item').append(respData.items[index]),
                    );
                };
            },
            error: function(raw) {
                $("#info-alert").delay(1000).fadeOut();
                $("#danger-alert").empty();
                $("#danger-alert").append('出错了 ' + raw.responseText).show().delay(10000).fadeOut();
            },
        });
    });

    $('#menu2-search').click(function() {
        var data = {};
        var itemId = $("#item-input").val();

        $.ajax({
            type: 'GET',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/endpoint/search_item?itemId=' + itemId,
            beforeSend: function() {
                $("#info-alert").empty();
                $("#info-alert").append('正在查询').show();
            },
            success: function(raw) {
                $("#info-alert").delay(1000).fadeOut();
                respData = JSON.parse(raw);
                console.log(JSON.stringify(respData));
                $('#menu2-user-result').empty();
                if (respData.users && respData.users.length > 0) {
                    $('#menu2-user-result').append($('<li>').attr('class', 'list-group-item')
                        .append('共找到推荐用户' + respData.users.length + '个'));
                } else {
                    $('#menu2-user-result').append($('<li>').attr('class', 'list-group-item')
                        .append('共找到推荐用户0个'));
                }

                for (index in respData.users) {
                    $('#menu2-user-result').append(
                        $('<li>').attr('class', 'list-group-item').append(respData.users[index]),
                    );
                };
            },
            error: function(raw) {
                $("#info-alert").delay(1000).fadeOut();
                $("#danger-alert").empty();
                $("#danger-alert").append('出错了 ' + raw.responseText).show().delay(10000).fadeOut();
            },
        });
    });
});