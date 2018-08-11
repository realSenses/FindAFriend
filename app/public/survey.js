function randomName() {
  var currentURL = window.location.origin;

  return $.ajax({
    url: currentURL + "/api/random",
    method: "GET"
  }).then(function(names) {

    var male = names.firstNames.male;
    var female = names.firstNames.female;

    var character = {};

    if ((Math.floor(Math.random() * 2) === 1)) {
      character.firstname = male[Math.floor(Math.random() * male.length)];
      character.gender = "male";
    } else {
      character.firstname = female[Math.floor(Math.random() * female.length)];
      character.gender = "female";
    }
    character.lastname = names.lastNames[Math.floor(Math.random() * names.lastNames.length)];

    return character

  });
}

// generate questions html
var questions = [
'Your mind is always buzzing with unexplored ideas and plans.', 
'Generally speaking, you rely more on your experience than your imagination.', 
'You find it easy to stay relaxed and focused even when there is some pressure.', 
'You rarely do something just out of sheer curiosity.', 
'People can rarely upset you.', 
'It is often difficult for you to relate to other people’s feelings.', 
'In a discussion, truth should be more important than people’s sensitivities.', 
'You rarely get carried away by fantasies and ideas.', 
'You think that everyone’s views should be respected regardless of whether they are supported by facts or not.', 
'You feel more energetic after spending time with a group of people.'
];
for (var i = 0; i < questions.length; i++) {
  $('.radio-questions').append(questions[i] + '<br>');
  var name = 'question' + i;
  for (var r = 1; r < 6; r++) {
    // generate radio buttons
    var label = $('<label>')
      .addClass('radio')
      .html(r);
    var input = $('<input type="radio">')
      .attr('name', name)
      .attr('value', r)
      .appendTo(label);
    if (r === 3) {
      input.prop('checked', true)
    }
    label.appendTo($('.radio-questions'));
  }
  $('.radio-questions').append('<br><br>');
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//randomize survey results and generate random name and image
$(".randomize").on("click", function() {
  var rand;
  for (var i = 0; i < questions.length; i++) {
    rand = Math.floor(Math.random() * Math.floor(5));
    $('input:radio[name=question' + i + ']')[rand].checked = true;
  }

  randomName()
    .then(function(character) {

      var randomImgNum = (character.gender === "male" ? randomNum(1, 20) : randomNum(21, 40));

      $('#inputName').val(character.firstname + " " + character.lastname);
      $('#inputImage').val('images/people_' + randomImgNum + '.png');

      var img = $('<img>');
      img.attr('src', 'images/people_' + randomImgNum + '.png');
      img.css('width', '100px');
      $('#image').html(img);

    })

});



// submit button
$(".submit").on("click", function(event) {
  event.preventDefault();

  var responses = [];

  for (var i = 0; i < questions.length; i++) {
    responses.push(parseInt($('input[name=' + 'question' + i + ']:checked').val()));

  }

  var newFriend = {
    name: $("#inputName").val().trim(),
    photo: $("#inputImage").val().trim(),
    scores: responses // responses
  };

  //console.log(newFriend);

  $.post("/api/friends", newFriend,
  function(data) {

    if (data) {
      console.log('new friend added');
      console.log(newFriend);    
    }

    var currentURL = window.location.origin;
    $.ajax({
      url: currentURL + "/api/friends",
      method: "GET"
    }).then(function(friends) {
      displayResults(friends, newFriend)
    });

  });

});


function displayResults(friends, newFriend){


  var userScore = newFriend.scores;


  var bestFriend = {};
  var bestFriendScore = 99;
  var bfIndex;

  for (var i = 0; i < friends.length-1; i++){ // subtract 1 so user score isn't compared to themselves     

    var databaseScore = friends[i].scores; 

    var checkScore = diffCheck(userScore, databaseScore)

    if (checkScore < bestFriendScore) {
      bestFriendScore = checkScore;

      console.log(bestFriendScore);
      console.log(friends[i].name);
      bfIndex = i
    }

  }

  // console.log("INDEX" + bfIndex);

  $('#myModal').show(); 
  $('.modal-body').html('');
  $('.modal-body').append("Here's your new best friend!<br>");


  //$('.modal-body').append(friends[bfIndex].scores);

  var img = $('<img>');
  img.attr('src', friends[bfIndex].photo);
  img.css('width', '100px');
  $('.modal-body').append('<br>');         
  $('.modal-body').append(img);
  $('.modal-body').append('<br>');
  $('.modal-body').append(friends[bfIndex].name);
  $('.modal-body').append('<br>');

}


// myArray = [3, 2, 1, 5, 1];
// computerArray = [4, 2, 1, 2, 3];

function diffCheck(arr1, arr2) {
  // make sure arrays are the same length
  // if (arr1.length != arr2.length) {
  //   throw "Arrays not the same length!";
  // }

  var totalDiff = 0;

  for (var i = 0; i < arr1.length; i++) {
    totalDiff += Math.abs(arr1[i] - arr2[i]);
  }

  return totalDiff;
}

//diffCheck(myArray, computerArray);



$('#myBtn').click(function() {
  $('#myModal').show();
  $('.modal-body').html("hello!");
});

$('.close').click(function() {
  $('#myModal').hide();
});

var modal = document.getElementById('myModal');

window.onclick = function(event) {
  if (event.target == modal) {
    $('#myModal').hide();
  }
}

