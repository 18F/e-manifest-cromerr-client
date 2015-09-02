App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      authToken: Session.get("authToken")
    };
  },
  render: function() {
    var that = this;
    
    var everythingElse = function() {
      if (that.data.authToken) {
        return <div>things go here once you have a token</div>;
      }
    };
    
    return (
      <div>
      <Authenticate/>
      { everythingElse() }
      </div>
    );
  }
});
