Meteor.methods({
  authorizeAuthenticate: function(userId, password) {
    var requestDoc = XML.Document()
                        .node("soap12:Envelope")
                        .attr({
                          "xmlns:cdx": "http://www.exchangenetwork.net/wsdl/register/1",
                          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                          "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                          "xmlns:soap12": "http://www.w3.org/2003/05/soap-envelope"
                        })
                        .node("soap12:Body")
                        .node("cdx:Authenticate")
                        .node("userId", userId)
                        .parent()
                        .node("credential", password)
                        .parent()
                        .node("domain", "default")
                        .parent()
                        .node("authenticationMethod", "password")
                        .parent()
                        .parent()
                        .parent();
    var authenticateXmlRequest = requestDoc.toString();
    console.log("going to send xml: " +authenticateXmlRequest);
    try {

      var result = HTTP.post("https://devngn.epacdxnode.net/cdx-register/services/RegisterService", {
        content: authenticateXmlRequest
      });

      console.log("success: " + result.content);
      var xmlResponseContent = XML.parseXml(result.content);
      console.log("parsed xml: " + xmlResponseContent);
      var resultJson = getAuthorizeAuthenticateJson(xmlResponseContent);
      return resultJson;
    } catch (error) {
      var xmlResponseContent = XML.parseXml(error.response.content);
      console.log("soap error: " + xmlResponseContent);
      var resultJson = getAuthenticateErrorJson(xmlResponseContent);
      throw new Meteor.Error(resultJson);
    }
  }
});

var getAuthorizeAuthenticateJson = function(xml) {
  var securityToken = xml.get("/soap:Envelope/soap:Body/ns2:AuthenticateResponse/securityToken", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/1"
  }).text();
  console.log("securityToken: " + securityToken);
  return { securityToken: securityToken };
}

var getAuthenticateErrorJson = function(xml) {
  var fault = xml.get("/soap:Envelope/soap:Body/soap:Fault/soap:Detail/ns1:RegisterFault", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns1": "http://www.exchangenetwork.net/wsdl/register/1",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/1"
  });

  var description = fault.get("description").text();

  return {
    description: description
  }
}
