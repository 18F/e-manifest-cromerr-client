Meteor.methods({
  getQuestion: function(props) {
    return registerSignService({
      props: props,
      templateName: "getQuestion",
      success: getQuestionJson
    });
  }
});

var getQuestionJson = function(xml) {
  var questionId = xml.get("/soap:Envelope/soap:Body/ns2:GetQuestionResponse/question/questionId", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  }).text();
  
  var questionText = xml.get("/soap:Envelope/soap:Body/ns2:GetQuestionResponse/question/text", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  }).text();

  console.log("questionId/text: " + questionId + "/" + questionText);
  // seems to return one for now
  return { questions: [ {
    questionId: questionId,
    questionText: questionText
  }]};
};

