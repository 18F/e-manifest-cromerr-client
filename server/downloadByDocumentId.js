Meteor.methods({
  downloadByDocumentId: function(props) {
    return registerSignService({
      props: props,
      templateName: "downloadByDocumentId",
      success: getJson
    });
  }
});

var getJson = function(xml) {
  var signatureDocumentName =
  xml.get("/soap:Envelope/soap:Body/ns2:DownloadByDocumentIdResponse/signatureDocument/Name", {
    "soap": "http://www.w3.org/2003/05/soap-envelope",
    "ns2": "http://www.exchangenetwork.net/wsdl/register/sign/1"
  }).text();
  
  console.log("documentName: " + signatureDocumentName);
  
  return { documentName: signatureDocumentName };
}

