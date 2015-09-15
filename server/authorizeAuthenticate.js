Meteor.methods({
  authorizeAuthenticate: function(userId, password) {
    var requestTemplateText = Assets.getText("authorizeAuthenticateRequest.xml");
    var requestTemplate = _.template(requestTemplateText);

    var requestXml = requestTemplate({
      userId: userId,
      password: password
    });
    
    // service sends back a multipart mime response
    try {

      var result = HTTP.post("https://devngn.epacdxnode.net/cdx-register/services/RegisterSignService", {
        content: requestXml
      });

      console.log("success: " + result.content);
      var unwrappedContent = getSingleMultipartContent(result.content);
      var xmlResponseContent = XML.parseXml(unwrappedContent);
      console.log("parsed xml: " + xmlResponseContent);
      var resultJson = getAuthorizeAuthenticateJson(xmlResponseContent);
      return resultJson;
    } catch (error) {
      console.log(error.response.content);
      var unwrappedContent = getSingleMultipartContent(result.content);
      var xmlResponseContent = XML.parseXml(unwrappedContent);
      console.log("soap error: " + xmlResponseContent);
      var resultJson = getAuthenticateErrorJson(xmlResponseContent);
      throw new Meteor.Error(resultJson);
    }
  }
});

var getAuthorizeAuthenticateJson = function(xml) {
  var securityToken = xml.get("/soap:Envelope/soap:Body/ns2:AuthenticateResponse/securityToken", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  }).text();
  console.log("securityToken: " + securityToken);
  return { securityToken: securityToken };
}

var getAuthenticateErrorJson = function(xml) {
  var fault = xml.get("/soap:Envelope/soap:Body/soap:Fault/soap:Detail/ns1:RegisterFault", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns1": "http://www.exchangenetwork.net/wsdl/register/sign/1",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  });

  var description = fault.get("description").text();

  return {
    description: description
  }
}
