Meteor.methods({
  getQuestion: function(props) {
    return registerSignService({
      props: props,
      templateName: "getQuestion",
      success: getQuestionJson
    });
  }
});

var getAuthorizeAuthenticateJson = function(xml) {
  var questions = xml.get("/soap:Envelope/soap:Body/ns2:GetQuestionResponse/question", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  });
  
  var questions = [];

  _.each(questions, function(question) {
    var questionId = question.get("./questionId").text;
    var questionText = question.get("./text").text();

    questions.push({
      questionId: questionId,
      questionText: questionText
    });
    
    console.log("question: " + questionText);
  });
  
  return { questions: questions };
}

