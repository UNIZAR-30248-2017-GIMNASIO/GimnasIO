/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

$(document).ready(() => {


  $('#registro').submit((event) => {
    event.preventDefault();
      $.ajax({
      url: '/gym/newGym',
      type: 'POST',
          beforeSend(request) { //TODO: pasar a archivo secreto, no dejar hardcodeado!
              request.setRequestHeader("user", "gpsAdmin");
              request.setRequestHeader("pwd", "Gps@1718");
          },
      datatype: "json",
      data: $(event.currentTarget).serialize(),
      success() {
          $('#result').html(`<div class='alert alert-success lead'><p>Registrado con éxito.<br>Hemos enviado las instrucciones al email facilitado.</p></div>`);
      },
      error() {
        $('#result').html("<div class='alert alert-danger lead'>¡Vaya! Parece que algo ha ido mal.</br>${msg.message}</div>");
      },
    });
  });

});
