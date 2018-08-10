var commentHelper = "";
var titleHelper = "";
var commentViewHelper ="";
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
  titleHelper="";
})

//button to submit a comment to the database
$(document).on("click", ".commentSubmit", function(event) {
  event.preventDefault();
  $("#displayComments"+commentHelper).show();
  // Create an addComment Object
  var addComment = {
    name: $("#userName")
      .val()
      .trim(),
      message: $("#userComment")
      .val()
      .trim(),
      articleID: commentHelper
   };
  console.log(addComment);
  $.ajax("/articles/comments/"+commentHelper, {
    type: "POST",
    data: addComment
  }).then(function () {
    console.log("Added comment");
    commentHelper="";
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
