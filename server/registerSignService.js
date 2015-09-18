registerSignService = function(options) {
  var props = options.props;
  var templateName = options.templateName;
  var successCallback = options.success;
  var errorCallback = options.error;

  var requestTemplateText = Assets.getText(templateName + "Request.xml");
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

    if (successCallback) {
      var resultJson = successCallback(xmlResponseContent);
      return resultJson;
    }
  } catch (error) {
    console.log(error);
    var unwrappedContent = getSingleMultipartContent(error.response.content);
    var xmlResponseContent = XML.parseXml(unwrappedContent);

    if (errorCallback) {
      console.log("soap error: " + xmlResponseContent);
      var resultJson = error(xmlResponseContent);
      throw new Meteor.Error(resultJson);
    }

    var resultJson = handleRegisterSignError(xmlResponseContent);
    throw new Meteor.Error(resultJson);
  }
};

var handleRegisterSignError = function(xml) {
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
