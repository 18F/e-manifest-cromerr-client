getSingleMultipartContent = function(multipartContentWrappingSingleContent) {
  var contentAfterHeader = multipartContentWrappingSingleContent.split("\r\n\r\n")[1];
  var contentBeforeBoundarySeparator = contentAfterHeader.split("\r\n")[0];
  return contentBeforeBoundarySeparator;
};

