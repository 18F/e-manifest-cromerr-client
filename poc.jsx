if (Meteor.isClient) {

  Meteor.startup(function() {
    var anchorElement = document.getElementById("app-body");
    React.render(<App />, anchorElement);
  });
  
}

if (Meteor.isServer) {
  
  Meteor.startup(function () {
    // code to run on server at startup
  });

}
