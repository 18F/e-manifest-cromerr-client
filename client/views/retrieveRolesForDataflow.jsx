RetrieveRolesForDataflow = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken"),
      authUser: Session.get("authUser"),
      roles: Session.get("roles"),
      retrieveRolesForDataflowError: Session.get("retrieveRolesForDataflowError")
    };
  },
  getInitialState: function() {
    return {
      disabled: false
    };
  },
  render: function() {
    var that = this;
    var disabled = this.state.disabled;

    var showError = function() {
      if (that.data.retrieveRolesForDataflowError) {
        return <div data-error>{ that.data.retrieveRolesForDataflowError }</div>;
      }
    };
    
    var retrieveRoles = function() {
      that.setState({ disabled: true });
      postToCDX();
    };

    var postToCDX = function() {
      var roles = that.refs["dataflowName"].value;

      var params = {
        securityToken: that.data.securityToken,
        userId: that.data.authUser.userId,
        firstName: that.data.authUser.firstName,
        lastName: that.data.authUser.lastName,
        middleInitial: that.data.authUser.lastName,
        dataflowName: "DEMO2: EPA Demonstration 2" // should default, but user input
      };
      
      Meteor.call("retrieveRolesForDataflow", params, function(error, result) {
        if (error) {
          Session.set("retrieveRolesForDataflowError", error.error.description);
          that.setState({ disabled: false });
        } else {
          Session.set("roles", result.roles);
          Session.set("retrieveRolesForDataflow", undefined);
        }
      });
        
    };
    
    var clear = function() {
      that.setState({ disabled: false });
      Session.set("roles", undefined);
    };

    if (!this.data.roles) {
      return (
        <section>
        <h1>Retrieve Roles for Dataflow</h1>
        <p>Finds the roles available for a user, needed to create a CROMERR activity. Uses data previously retrieved from other requests plus a dataflow name.</p>
        { showError() }
        <label htmlFor="dataflowName">Dataflow name <input id="dataflowName" name="dataflowName" disabled={disabled} ref="dataflowName" defaultValue="DEMO2: EPA Demonstration 2"/></label>
        <button type="submit" onClick={retrieveRoles} disabled={disabled}>retrieve roles</button>
        </section>
      );
    }

    var listRoles = function() {
      return _.map(this.data.roles, function(role) {
        return <li>role</li>
      });
    };
    
    return (
      <section>
      <h1>Retrieve Roles for Dataflow</h1>
      <p>Roles retrieved.</p>
      <ul>
      { listRoles() }
      </ul>
      <button onClick={clear}>use different dataflow</button>
      </section>
    );

  }
});
