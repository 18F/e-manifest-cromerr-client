AuthorizeAuthenticate = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken"),
      securityTokenError: Session.get("securityTokenError")
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

    var showAuthError = function() {
      if (that.data.securityTokenError) {
        return <div data-error>{ that.data.securityTokenError }</div>;
      }
    };
    
    var authenticate = function() {
      that.setState({ disabled: true });
      postAuthToCDX();
    };

    var postAuthToCDX = function() {
      var userId = React.findDOMNode(that.refs["userId"]).value;
      var password = React.findDOMNode(that.refs["password"]).value;
      Meteor.call("authorizeAuthenticate", userId, password, function(error, result) {
        if (error) {
          Session.set("securityTokenError", error.error.description);
          that.setState({ disabled: false });
        } else {
          Session.set("securityToken", result.securityToken);
          Session.set("securityTokenError", undefined);
        }
      });
        
    };
    
    var clearUser = function() {
      that.setState({ disabled: false });
      Session.set("securityToken", undefined);
    };

    if (!this.data.securityToken) {
      return (
        <section>
        <h1>Authorize/Authenticate</h1>
        <p>Gets the authentication token</p>
        { showAuthError() }
        <label htmlFor="userId">userId <input id="userId" name="userId" disabled={disabled} ref="userId"/></label>
        <label htmlFor="password">password <input id="password" name="password" disabled={disabled} ref="password"/></label>
        <button type="submit" onClick={authenticate} disabled={disabled}>authenticate</button>
        </section>
      );
    }

    return (
      <section>
      <h1>Authorize/Authenticate</h1>
      <p>Authenticated</p>
      <label htmlFor="securityToken">token: <span id="tokan">{this.data.securityToken}</span></label>
      <button onClick={clearUser}>get new token</button>
      </section>
    );

  }
});
