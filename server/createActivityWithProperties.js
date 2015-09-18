Meteor.methods({
  createActivityWithProperties: function(props) {
    return registerSignService({
      props: props,
      templateName: "createActivityWithProperties",
      success: getResponseAsJson
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

