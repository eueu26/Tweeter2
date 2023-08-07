/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // ensure safe "encoded" representation
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //direct tweets submited to #tweet-container
  const renderTweets = function(tweets) {
    $('#tweets-container').empty();
    for (let tweet of tweets) {
      const showTweet = createTweetElement(tweet);
      $('#tweets-container').append(showTweet);
    }
  };

  //Create new tweet element for tweet data
  const createTweetElement = function(tweetData) {

    const HTML = `${escape(tweetData.content.text)}`;
  
   
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
        ${HTML}
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



  // Get request for ajax to pull tweets from server
  const loadTweets = function() {
    $.get("/tweets/", function(newTweet) {
      renderTweets(newTweet.reverse());
    });
  };

  loadTweets();

  //Adds new tweet when submit is clicked
  $("#new-tweet-text").submit(function(event) {
    event.preventDefault();
    const textInputLength = $(this).find("#tweet-text").val().length;

    if (!textInputLength) {
      $("#error-message-empty").slideDown("slow");
      
    } else {
      const newTweet = $(this).serialize();
      $.post("/tweets/", newTweet, () => {
        $(this).find("#tweet-text").val("");
        $(this).find(".counter").val(140);
        loadTweets();
      });
    }
  });
});


