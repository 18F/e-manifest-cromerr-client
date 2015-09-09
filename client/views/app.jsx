App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      authUser: Session.get("authUser"),
      securityToken: Session.get("securityToken")
    };
  },
  render: function() {
    var that = this;

    var emitAuthorizeAuthenticate = function() {
      if (that.data.authUser) {
        return <AuthorizeAuthenticate />;
      }
    };

    var emitRetrieveRoles = function() {
      if (that.data.securityToken) {
        console.log("Next, pick up the dataflow roles for the user (not implemented)");
      }
    };
    
    var emitCreateActivity = function() {
      if (that.data.dataflowRoles) {
        return <CreateActivityWithProperties/>;
      }
    };
    
    return (
      <div>
        <Authenticate/>
        { emitAuthorizeAuthenticate() }
        { emitRetrieveRoles() }
        { emitCreateActivity() }
      </div>
    );
  }
});
