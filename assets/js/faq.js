$(document).ready(function () {
    $("#faq blockquote").hide();
    $("#faq h3").click(function () {
        $(this).next("#faq blockquote").slideToggle(200);
    });
});