Meteor.methods({
  authenticate: function(userId, password) {
    var requestTemplateText = Assets.getText("authenticateRequest.xml");
    var requestTemplate = _.template(requestTemplateText);

    var requestXml = requestTemplate({
      userId: userId,
      password: password
    });

    try {

      var result = HTTP.post("https://devngn.epacdxnode.net/cdx-register/services/RegisterAuthService", {
        content: requestXml
      });

      console.log("success: " + result.content);
      var xmlResponseContent = XML.parseXml(result.content);
      console.log("parsed xml: " + xmlResponseContent);
      var resultJson = getAuthenticateJson(xmlResponseContent);
      return resultJson;
    } catch (error) {
      var xmlResponseContent = XML.parseXml(error.response.content);
      console.log("soap error: " + xmlResponseContent);
      var resultJson = getAuthenticateErrorJson(xmlResponseContent);
      throw new Meteor.Error(resultJson);
    }
  }
});

var getAuthenticateJson = function(xml) {
  var user = xml.get("/soap:Envelope/soap:Body/ns2:AuthenticateResponse/User", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/auth/1"
  });

  var firstName = user.get("firstName").text();
  var lastName = user.get("lastName").text();

  var hasMiddleInitial = user.get("middleInitial");
  var middleInitial = "";

  if (hasMiddleInitial) {
    middleInitial = user.get("middleInitial").text();
  }
  
  var userId = user.get("userId").text();
  
  return {
    firstName: firstName,
    lastName: lastName,
    middleInitial: middleInitial,
    userId: userId
  }
}

var getAuthenticateErrorJson = function(xml) {
  var fault = xml.get("/soap:Envelope/soap:Body/soap:Fault/soap:Detail/ns1:RegisterAuthFault", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns1": "http://www.exchangenetwork.net/wsdl/register/auth/1",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/auth/1"
  });

  var description = fault.get("description").text();

  return {
    description: description
  }
}
