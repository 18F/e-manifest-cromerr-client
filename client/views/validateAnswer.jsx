ValidateAnswer = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      securityToken: Session.get("securityToken"),
      authUser: Session.get("authUser"),
      activityId: Session.get("activityId"),
      questions: Session.get("questions"),
      validAnswer: Session.get("validAnswer"),
      validateAnswerError: Session.get("validateAnswerError")
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
      if (that.data.validateAnswerError) {
        return <div data-error>{ that.data.validateAnswerError }</div>;
      }
    };
    
    var validateAnswer = function() {
      that.setState({ disabled: true });
      postToCDX();
    };

    var postToCDX = function() {
      var answerRef = that.refs["answer"];
      var answerNode = React.findDOMNode(answerRef);
      var answer = answerNode.value;
      
      var params = {
        securityToken: that.data.securityToken,
        activityId: that.data.activityId,
        userId: that.data.authUser.userId,
        questionId: that.data.questions[0].questionId,
        answer: answer
      };
      
      Meteor.call("validateAnswer", params, function(error, result) {
        if (error) {
          Session.set("validateAnswerError", error.error.description);
          that.setState({ disabled: false });
        } else {
          Session.set("validAnswer", result.isValidAnswer);
          Session.set("validateAnswerError", undefined);
        }
      });
        
    };

    var clear = function() {
      that.setState({ disabled: false });
      Session.set("validAnswer", undefined);
    };

    if (!(this.data.validAnswer)) {
      return (
        <section>
          <h1>Validate answer</h1>
          <p>Say what you know</p>
          { showError() }
          <label htmlFor="answer">answer
            <input id="answer" name="answer" disabled={disabled}
                   ref="answer"/>
          </label>
          <button type="submit" onClick={validateAnswer} disabled={disabled}>submit answer</button>
        </section>
      );
    }

    var emitAnswerResult = function() {
      if (that.data.validAnswer) {
        return <p>Answer accepted.</p>;
      } else {
        return <p>Wrong answer.</p>;
      }
    };
    
    return (
      <section>
        <h1>Validate answer</h1>
        <p>Answer submitted.</p>
        { emitAnswerResult() }
        <button onClick={clear}>answer again</button>
      </section>
    );

  }
});
