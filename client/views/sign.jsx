Sign = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken"),
      activityId: Session.get("activityId"),
      documentId: Session.get("documentId")
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

    var sign = function() {
      that.setState({ disabled: true });
      postToCDX();
    };

    var postToCDX = function() {
      var contentRef = that.refs["content"];
      var contentNode = React.findDOMNode(contentRef);
      var content = contentNode.value;

      var documentNameRef = that.refs["documentName"];
      var documentNameNode = React.findDOMNode(documentNameRef);
      var documentName = documentNameNode.value;

      var props = {
        securityToken: that.data.securityToken,
        activityId: that.data.activityId,
        content: content,
        documentName: documentName
      };

      Meteor.call("sign", props, function(error, result) {
        if (error) {
          Session.set("signError", error.error.description);
          that.setState({ disabled: false });
        } else {
          Session.set("documentId", result.documentId);
          Session.set("signError", undefined);
        }
      });
        
    };
    
    var clear = function() {
      that.setState({ disabled: false });
      Session.set("documentId", undefined);
    };

    var showError = function() {
      if (that.data.signError) {
        return <div data-error>{ that.data.signError }</div>;
      }

    };
    
    if (!this.data.documentId) {
      return (
        <section>
        <h1>Sign</h1>
        <p>Signs a document for the authenticated user associated with the activity id</p>
        { showError() }
        <label htmlFor="documentName">document name: <input id="documentName" ref="documentName"/></label>
        <label htmlFor="content">document content: <textArea id="content" ref="content"/></label>
        <button type="submit" onClick={sign} disabled={disabled}>sign document</button>
        </section>
      );
    }

    return (
      <section>
      <h1>Sign</h1>
      <p>Signing successful</p>
      <p>documentId: <span>{this.data.documentId}</span></p>
      
      <button onClick={clear}>try again</button>
      </section>
    );

  }
});
