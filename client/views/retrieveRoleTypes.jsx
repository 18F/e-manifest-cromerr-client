RetrieveRoleTypes = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken"),
      authUser: Session.get("authUser"),
      roles: Session.get("roles"),
      retrieveRoleTypesError: Session.get("retrieveRoleTypesError")
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
      if (that.data.retrieveRoleTypesError) {
        return <div data-error>{ that.data.retrieveRoleTypesError }</div>;
      }
    };
    
    var retrieveRoles = function() {
      that.setState({ disabled: true });
      postToCDX();
    };

    var postToCDX = function() {
      var dataflowNameInput = that.refs["dataflowName"];
      var dataflowName = React.findDOMNode(dataflowNameInput).value;

      var params = {
        securityToken: that.data.securityToken,
        dataflowName: dataflowName
      };

      console.log("parameters: " + JSON.stringify(params));
      Meteor.call("retrieveRoleTypes", params, function(error, result) {
        if (error) {
          Session.set("retrieveRoleTypesError", error.error.description);
          that.setState({ disabled: false });
        } else {
          Session.set("roles", result.roles);
          Session.set("dataflowName", dataflowName);
          Session.set("retrieveRoleTypesError", undefined);
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
          <h1>Retrieve Role Types</h1>
          <p>Finds the roles available for a user, needed to create a CROMERR activity. Uses data previously retrieved from other requests plus a dataflow name.</p>
          { showError() }
          <label htmlFor="dataflowName">Dataflow name <input id="dataflowName" name="dataflowName" disabled={disabled} ref="dataflowName" defaultValue="DEMO2: EPA Demonstration 2"/></label>
          <button type="submit" onClick={retrieveRoles} disabled={disabled}>retrieve roles</button>
          <UseDefaultRoles/>
        </section>
      );
    }

    var listRoles = function() {
      return _.map(that.data.roles, function(role) {
        return <li key={role.roleId}>{role.roleId} : {role.roleName}</li>
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
