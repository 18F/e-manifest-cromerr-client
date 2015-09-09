App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken")
    };
  },
  render: function() {
    var that = this;
    
    var everythingElse = function() {
      if (that.data.securityToken) {
        return <div>things go here once you have a token</div>;
      }
    };
    
    return (
      <div>
        <Authenticate/>
        <AuthorizeAuthenticate/>
      { everythingElse() }
      </div>
    );
  }
});
