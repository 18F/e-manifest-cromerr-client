Meteor.methods({
  retrieveRoleTypes: function(props) {
    var requestTemplateText = Assets.getText("retrieveRoleTypesRequest.xml");
    var requestTemplate = _.template(requestTemplateText);

    var requestXml = requestTemplate(props);

    try {

      var result = HTTP.post("https://devngn.epacdxnode.net/cdx-register/services/RegisterService", {
        content: requestXml
      });

      console.log("success: " + result.content);
      var xmlResponseContent = XML.parseXml(result.content);
      console.log("parsed xml: " + xmlResponseContent);
      var resultJson = parseResponseToJson(xmlResponseContent);
      return resultJson;
    } catch (error) {
      console.log(error);
      debugger;

      var xmlResponseContent = XML.parseXml(error.response.content);
      console.log("soap error: " + xmlResponseContent);
      var resultJson = getAuthenticateErrorJson(xmlResponseContent);
      throw new Meteor.Error(resultJson);
    }
  }
});

var parseResponseToJson = function(xml) {
  var roles = xml.get("/soap:Envelope/soap:Body/ns2:RetrieveRolesForDataflowResponse/Role", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/1"
  });
  console.log("roles: " + roles);
  return { roles: roles };
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
