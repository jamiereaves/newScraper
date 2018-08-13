var commentHelper = "";
var titleHelper = "";
var commentViewHelper ="";
var messageHelper = "";
//button to save an article
$(document).on("click", ".saveBtn", function(event) {
  event.preventDefault();
  var helper = $(this).val()
  console.log(helper);
  $.ajax("/articles/saved/" + helper, {
    type: "PUT"
  }).then(function () {
    console.log("saved article");
    location.reload();
  });
});

//button to comment on an article
$(document).on("click", ".commentBtn", function(event) {
  event.preventDefault();
  $("#modalCommentTitleA").text("");
  commentHelper = $(this).val();
  titleHelper = $("#"+commentHelper).text();
  $("#modalCommentTitleA").text(titleHelper);
  console.log(commentHelper);
  console.log(titleHelper);
  $('#commentSubmitModal').modal();
})

//button to edit an article comment
$(document).on("click", ".editBtn", function() {
  event.preventDefault();
  commentHelper="";
  titleHelper="";
  $("#modalCommentTitleB").text("");
  commentHelper = $(this).val();
  titleHelper = $("#commentTitle"+commentHelper).text();
  messageHelper = $("#"+commentHelper).text();
  $("#modalCommentTitleB").text(titleHelper);
  $("#userCommentEdit").text(messageHelper);
  console.log("articleID: " + commentHelper);
  console.log("articleName: " + titleHelper);
  console.log("message: " + messageHelper);
  $("#commentEditModal").modal();
})

//button to submit a new comment to the database
$(document).on("click", ".commentSubmit", function(event) {
  event.preventDefault();
  console.log(titleHelper);
  // Create an addComment Object
  var addComment = {
    name: $("#userName")
      .val()
      .trim(),
      message: $("#userComment")
      .val()
      .trim(),
      articleID: commentHelper,
      articleName: titleHelper
   };
  console.log(addComment);
  $.ajax("/articles/comments/"+commentHelper, {
    type: "POST",
    data: addComment
  }).then(function () {
    console.log("Added comment");
    commentHelper="";
    titleHelper="";
  });
});

//button to submit an edited comment to the database
$(document).on("click", "#editCommentSubmit", function(event) {
  event.preventDefault();
  console.log("articleName: " + titleHelper);
  console.log("articleID: " + commentHelper);
  // Create an addComment Object
  var addComment = {
      message: $("#userCommentEdit")
      .val()
      .trim()
   };
  console.log(addComment);
  $.ajax("/articles/comments/edit/"+commentHelper, {
    type: "PUT",
    data: addComment
  }).then(function () {
    console.log("Added comment");
    location.reload();
  });
});

//button to view comments
$(document).on("click", ".displayComment", function(event) {
  commentViewHelper = $(this).val();
  $.ajax("/comments/" + commentViewHelper, {
    type: "GET"
  }).then(function () {
    console.log("saved article");
  });

});

//button to scrape new articles
$(document).on("click", ".scraper", function(event) {
  event.preventDefault();
  $.ajax("/scrape/", {
    type: "GET"
  }).then(function () {
    console.log("here's the new stuff!");
  });
  location.reload();
  console.log("here's the new stuff!");

});
