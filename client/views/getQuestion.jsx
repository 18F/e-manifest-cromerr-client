GetQuestion = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken"),
      activityId: Session.get("activityId"),
      authUser: Session.get("authUser"),
      questions: Session.get("questions"),
      questionError: Session.get("questionError")
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

    var getQuestion = function() {
      that.setState({ disabled: true });
      postAuthToCDX();
    };

    var postAuthToCDX = function() {
      var props = {
        securityToken: that.data.securityToken,
        activityId: that.data.activityId,
        userId: that.data.authUser.userId
      };

      Meteor.call("getQuestion", props, function(error, result) {
        if (error) {
          Session.set("questionError", error.error.description);
          that.setState({ disabled: false });
        } else {
          Session.set("questions", result.questions);
          Session.set("questionError", undefined);
        }
      });
        
    };
    
    var clearQuestions = function() {
      that.setState({ disabled: false });
      Session.set("questions", undefined);
    };

    var emitQuestions = function() {
      return _.map(that.data.questions, function(question) {
        return <li>{question.questionId}: {question.questionText}</li>
      });
    };

    var showError = function() {
      if (that.data.questionError) {
        return <div data-error>{ that.data.questionError }</div>;
      }

    };
    
    if (!this.data.questions) {
      return (
        <section>
        <h1>Get questions</h1>
        <p>Gets the "what you know" questions for 2FA the user</p>
        { showError() }
        <button type="submit" onClick={getQuestion} disabled={disabled}>get questions</button>
        </section>
      );
    }

    return (
      <section>
      <h1>Get questions</h1>
      <p>questions:</p>
      <ul>
        { emitQuestions() }
      </ul>
      <button onClick={clearQuestions}>try again</button>
      </section>
    );

  }
});
