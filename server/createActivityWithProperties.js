Meteor.methods({
  createActivityWithProperties: function(props) {
    var requestTemplateText = Assets.getText("createActivityWithPropertiesRequest.xml");
    var requestTemplate = _.template(requestTemplateText);

    var requestXml = requestTemplate(props);

    try {

      var result = HTTP.post("https://devngn.epacdxnode.net/cdx-register/services/RegisterSignService", {
        content: requestXml
      });

      console.log("success: " + result.content);
      var unwrappedContent = getSingleMultipartContent(result.content);
      var xmlResponseContent = XML.parseXml(unwrappedContent);
      console.log("parsed xml: " + xmlResponseContent);
      var resultJson = getResponseAsJson(xmlResponseContent);
      return resultJson;
    } catch (error) {
      console.log(error);
      var unwrappedContent = getSingleMultipartContent(error.response.content);
      var xmlResponseContent = XML.parseXml(unwrappedContent);
      console.log("soap error: " + xmlResponseContent);
      var resultJson = getErrorAsJson(xmlResponseContent);
      throw new Meteor.Error(resultJson);
    }
  }
});

var getResponseAsJson = function(xml) {
  var activityId = xml.get("/soap:Envelope/soap:Body/ns2:CreateActivityWithPropertiesResponse/activityId", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  }).text();
  console.log("activityId: " + activityId);
  return { activityId: activityId };
}

var getErrorAsJson = function(xml) {
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
