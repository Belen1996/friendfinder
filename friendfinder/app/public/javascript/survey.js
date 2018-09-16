$("#surveyForm").on('submit', function (ev) {
    submitSurvey();
    return false;
});

$("#submit").on('submit', function (ev) {
    submitSurvey();
    return false;
});

$("#modal-close").on('click', function(ev) {
    $('#modal-content').modal('hide');
});

$("#failure-modal-close").on('click', function(ev) {
    $('#failure-modal').modal('hide');
});

const url = "./api/friends";

function submitSurvey() {
    let name = $("#name").val();
    let photo = $("#photo").val();
    var scores = [];
    for(i = 1; i < 11; i++) {
        scores.push($("#q"+i).val());
    }

    let surveyRequest = {
        name: name,
        photo: photo,
        scores: scores
    };

    $.post(url, surveyRequest, function(response, status) {
        if(status === "success") {
            let friendResponse = response;
            if(friendResponse._found) {
                let friendName = friendResponse._friend.name;
                let friendPhoto = friendResponse._friend.photo;
                // Show modal with data
                $("#match-name").html(friendName);
                $("#match-img").attr("src", friendPhoto);
                $('#modal-content').modal('show');
            } else {
                // Show modal with error
                $("#match-name-failed").html("Unfortunately, no matches were found");
                $('#failure-modal').modal('show');
            }
        } else {
            // Show modal with error
            $("#match-name-failed").html("Unfortunately, no matches were found");
            $('#failure-modal').modal('show');
        }
    });
}