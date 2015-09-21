CreateActivityWithProperties = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken"),
      authUser: Session.get("authUser"),
      roles: Session.get("roles"),
      activityId: Session.get("activityId"),
      createActivityError: Session.get("createActivityError")
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
      if (that.data.createActivityError) {
        return <div data-error>{ that.data.createActivityError }</div>;
      }
    };
    
    var createActivity = function() {
      that.setState({ disabled: true });
      postToCDX();
    };

    var postToCDX = function() {
      var activityDescriptionRef = that.refs["activityDescription"];
      var activityDescriptionNode = React.findDOMNode(activityDescriptionRef);
      var activityDescription = activityDescriptionNode.value;
      var selectedRoleRef = that.refs["roles"];
      var selectedRoleNode = React.findDOMNode(selectedRoleRef);
      var dataflowNameRef = that.refs["dataflowName"];
      var dataflowName = React.findDOMNode(dataflowNameRef).value;
      var roleCode = selectedRoleNode.value;
      var role = _.findWhere(that.data.roles, {roleId: roleCode});
      var roleName = role.roleName;
      
      var params = {
        securityToken: that.data.securityToken,
        userId: that.data.authUser.userId,
        firstName: that.data.authUser.firstName,
        lastName: that.data.authUser.lastName,
        middleInitial: that.data.authUser.middleInitial,
        activityDescription: activityDescription,
        dataflowName: dataflowName,
        roleCode: roleCode,
        roleName: roleName
      };
      
      Meteor.call("createActivityWithProperties", params, function(error, result) {
        if (error) {
          Session.set("createActivityError", error.error.description);
          that.setState({ disabled: false });
        } else {
          Session.set("activityId", result.activityId);
          Session.set("createActivityError", undefined);
        }
      });
        
    };

    var emitRoles = function() {
      return _.map(that.data.roles, function(role) {
        return <option key={role.roleId} value={role.roleId}>{role.roleName}</option>;
      });
    }
    
    var clear = function() {
      that.setState({ disabled: false });
      Session.set("activityId", undefined);
    };

    if (!(this.data.activityId)) {
      return (
        <section>
        <h1>Create Activity</h1>
        <p>Start the signing process.</p>
        { showError() }
        <label htmlFor="activityDescription">activity description
          <input id="activityDescription" name="activityDescription" disabled={disabled}
                 ref="activityDescription"/>
        </label>
        <label htmlFor="dataflowName">Dataflow name <input id="dataflowName" name="dataflowName"
                                                           disabled={disabled} ref="dataflowName"
                                                           defaultValue="eManifest"/></label>
        <select name="role" ref="roles">
          {emitRoles()}
        </select>
        <button type="submit" onClick={createActivity} disabled={disabled}>create activity</button>
        </section>
      );
    }

    return (
      <section>
      <h1>Create Activity</h1>
      <p>Activity created.</p>
      <label htmlFor="activityId">activityId: <span id="activityId">{this.data.activityId}</span></label>
      <button onClick={clear}>get different activity id</button>
      </section>
    );

  }
});
