/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  // ensure safe "encoded" representation
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //direct tweets submited to #tweet-container
  const renderTweets = function (tweets) {
    $("#tweets-container").empty();
    for (let tweet of tweets) {
      const showTweet = createTweetElement(tweet);
      $("#tweets-container").prepend(showTweet);
    }
  };

  //Create new tweet element for tweet data
  const createTweetElement = function (tweetData) {
    
    let $tweet = $(`
    <article class="tweet">
    <header class="tweet-header">
    <div class="user-profile">
    <img class="user-icon" src="${tweetData.user.avatars}"></img> 
    <h4 class="user-name">${tweetData.user.name}</h4>
    </div>
    <div>
    <h4 class="user-handle">${tweetData.user.handle}</h4>
    </div>
    </header>
    <div class="tweet-text">
    ${escape(tweetData.content.text)}
    </div>
    <footer class="tweet-footer">
    <span class="tweet-date">${timeago.format(tweetData.created_at)}</span>
    <div class="tweet-response">
    <i class="fas fa-flag"></i>
    <i class="fas fa-retweet"></i>
    <i class="fas fa-heart"></i>
    </div>
    </footer>
    </article>`);
    return $tweet;
  };

  // Get request for ajax to pull tweets to load
  const loadTweets = function() {
    $.ajax("/tweets", { method: "GET" }).then((tweets) => {
      renderTweets(tweets);
    });
  };
  loadTweets();
  

  //Adds new tweet when submit is clicked
  $("#error-message-empty").hide();
  $("#error-message-exceedMax").hide();

  $("#new-tweet-text").submit(function (event) {
    event.preventDefault();

    const textMax = 140;
    const textInputLength = $(this).find("#tweet-text").val().trim().length;

    if (!textInputLength) {
      $("#error-message-empty").slideDown();
      $("#error-message-exceedMax").hide();

    } else if (textInputLength - textMax > 0) {
      $("#error-message-exceedMax").slideDown();
      $("#error-message-empty").hide();
      
    } else {
      const newTweet = $(this).serialize();
      $.post("/tweets/", newTweet, () => {
        $(this).find("#tweet-text").val("");
        $(this).find(".counter").val(textMax);
        loadTweets();
      });
    }
  });
});
