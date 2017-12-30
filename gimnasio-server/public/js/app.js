/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function setSpinners() {
    let safeIconn = document.getElementById('safeIcon');
    let verifyIconn = document.getElementById('verifiedIcon');
    let loadingIconn = document.getElementById('loadingIcon');
    safeIconn.setAttribute('data-icon', 'spinner');
    safeIconn.classList.add('fa-spin');
    verifyIconn.setAttribute('data-icon', 'spinner');
    verifyIconn.classList.add('fa-spin');
    loadingIconn.setAttribute('data-icon', 'spinner');
    loadingIconn.classList.add('fa-spin');
}
// Get the modal
let modal = document.getElementById('myModal');
let safeIcon;
let verifyIcon;
let loadingIcon;
let isSafe = false;
let isVerified = false;

$(document).ready(() => {


  $('#shortener').submit((event) => {
    modal.style.display = "block";
    event.preventDefault();
      $.ajax({
      url: '/gym/newGym',
      type: 'POST',
      data: $(event.currentTarget).serialize(),
      success(msg) {
          $('#result').html(`<div class='alert alert-success lead'><a target='_blank' href='${msg.uri}'>${msg.uri}</a></br><p>The link will expire ${msg.expirationDate} at ${msg.expirationTime}</p></div>`);
      },
      error() {
          setSpinners();
          modal.style.display = "none";
        $('#result').html("<div class='alert alert-danger lead'>Um... Well... Something didn't go as planned.</br>Maybe try again?</div>");
      },
    });

      if(isSafe && isVerified) {


      }

  });

  $('#generate-new-qr').click(() => {
    $('#qr-adder').before(qrCardTemplate(numberOfQrsGenerated));
    $(`#qr-generator-${numberOfQrsGenerated}`).submit(qrGeneratorHandler(numberOfQrsGenerated));
    $(`#qr-logo-${numberOfQrsGenerated}`).change(logoChangeHandler(numberOfQrsGenerated));
    numberOfQrsGenerated += 1;
    if (numberOfQrsGenerated > 2) {
      $('#qr-adder').remove();
    }
  });



});
