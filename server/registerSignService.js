registerSignService = function(options) {
  var props = options.props;
  var templateName = options.templateName;
  var success = options.success;
  var error = options.error;

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

    if (success) {
      var resultJson = success(xmlResponseContent);
      return resultJson;
    }
  } catch (error) {
    console.log(error);
    var unwrappedContent = getSingleMultipartContent(error.response.content);
    var xmlResponseContent = XML.parseXml(unwrappedContent);
    console.log("soap error: " + xmlResponseContent);
    var resultJson = error(xmlResponseContent);
    throw new Meteor.Error(resultJson);
  }
};
