
$("#upload").on("click", function () {
    var message = "";
    message += $("#title").val() + "\n";
    $(".block").each(function () {
        message += $(this).val() + "\n";
    })
    console.log(message);
    uploadFacebook(message);
})
