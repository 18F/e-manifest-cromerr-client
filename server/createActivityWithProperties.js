Meteor.methods({
  createActivityWithProperties: function(props) {
    return registerSignService({
      props: props,
      templateName: "createActivityWithProperties",
      success: getResponseAsJson,
      error: getErrorAsJson
    });
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
