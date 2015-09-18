Meteor.methods({
  sign: function(props) {
    return registerSignService({
      props: props,
      templateName: "sign",
      success: getSignJson
    });
  }
});

var getSignJson = function(xml) {
  var documentId = xml.get("/soap:Envelope/soap:Body/ns2:SignResponse/documentId", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  }).text();
  console.log("documentId: " + documentId);
  
  return { documentId: documentId };
}

