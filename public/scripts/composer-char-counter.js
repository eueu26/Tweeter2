
$(document).ready(function() {
  $("#tweet-text").on("input", function() {
    const textInput = $(this).val().length;
    const textCount = 140 - textInput;

    const $countElement = $(this).parent().find(".counter");

    $countElement.text(textCount);

    if (textCount < 1) {
      $countElement.css("color", "red");

    } else {
      $countElement.css("color", "#545149");

    }
  });
});