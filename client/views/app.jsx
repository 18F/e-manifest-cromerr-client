App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      authUser: Session.get("authUser"),
      securityToken: Session.get("securityToken"),
      roles: Session.get("roles"),
      dataflowName: Session.get("dataflowName"),
      activityId: Session.get("activityId")
    };
  },
  render: function() {
    var that = this;

    var emitAuthorizeAuthenticate = function() {
      if (that.data.authUser) {
        return <AuthorizeAuthenticate/>;
      }
    };

    var emitRetrieveRoles = function() {
      if (that.data.securityToken) {
        return <RetrieveRoleTypes/>;
      }
    };
    
    var emitCreateActivity = function() {
      if (that.data.securityToken) {
        return <CreateActivityWithProperties/>;
      }
    };
    
    var emitGetQuestion = function() {
      if (that.data.activityId) {
        return <GetQuestion/>;
      }
    };
    
    return (
      <div>
        <Authenticate/>
        { emitAuthorizeAuthenticate() }
        { emitRetrieveRoles() }
        { emitCreateActivity() }
        { emitGetQuestion() }
      </div>
    );
  }
});
