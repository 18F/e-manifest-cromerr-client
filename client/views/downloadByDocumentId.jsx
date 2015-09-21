DownloadByDocumentId = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken"),
      activityId: Session.get("activityId"),
      documentId: Session.get("documentId"),
      documentName: Session.get("documentName"),
      downloadByDocumentIdError: Session.get("downloadByDocumentIdError")
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

    var downloadByDocumentId = function() {
      that.setState({ disabled: true });
      postToCDX();
    };

    var postToCDX = function() {
      var props = {
        securityToken: that.data.securityToken,
        activityId: that.data.activityId,
        documentId: that.data.documentId
      };

      Meteor.call("downloadByDocumentId", props, function(error, result) {
        if (error) {
          Session.set("downloadByDocumentIdError", error.error.description);
          that.setState({ disabled: false });
        } else {
          Session.set("documentName", result.documentName);
          Session.set("downloadByDocumentIdError", undefined);
        }
      });
        
    };
    
    var clear = function() {
      that.setState({ disabled: false });
      Session.set("documentId", undefined);
    };

    var showError = function() {
      if (that.data.downloadByDocumentIdError) {
        return <div data-error>{ that.data.downloadByDocumentIdError }</div>;
      }

    };
    
    if (!this.data.documentName) {
      return (
        <section>
        <h1>Download document by document id</h1>
        <p>Retrieves a document associated with the activity id/document id</p>
        { showError() }
        <button type="submit" onClick={downloadByDocumentId} disabled={disabled}>retrieve document</button>
        </section>
      );
    }

    return (
      <section>
        <h1>Download document by document id</h1>
        <p>Pulling the name for now as a sanity check</p>
        <p>Document name: <span>{this.data.documentName}</span></p>
        
        <button onClick={clear}>try again</button>
      </section>
    );

  }
});
