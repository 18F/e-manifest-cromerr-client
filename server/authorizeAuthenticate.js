Meteor.methods({
  authorizeAuthenticate: function(userId, password) {
    return registerSignService({
      props: { userId: userId, password: password},
      templateName: "authorizeAuthenticate",
      success: getAuthorizeAuthenticateJson,
      error: getAuthenticateErrorJson
    });
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
