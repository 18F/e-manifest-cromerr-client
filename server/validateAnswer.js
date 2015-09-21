Meteor.methods({
  validateAnswer: function(props) {
    return registerSignService({
      props: props,
      templateName: "validateAnswer",
      success: getValidateAnswerJson
    });
  }
});

var getValidateAnswerJson = function(xml) {
  var isValidAnswer = xml.get("/soap:Envelope/soap:Body/ns2:ValidateAnswerResponse/validAnswer", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  }).text();

  console.log("is valid answer: " + isValidAnswer);
  
  return { isValidAnswer: isValidAnswer };
}

