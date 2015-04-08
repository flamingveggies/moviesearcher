var fs = require('fs');

function mergeValues (values, content) {
  // cycle over the keys
    // replace all {{key}} with value from values object
  for (var key in values) {  
    content = content.replace("{{"+key+"}}",values[key]);
  }
  // return merged content
  return content;
}

function viewHTML(templateName, values, response) {
  // read from template file
  var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: "utf8"});
  // insert values into the content
  fileContents = mergeValues(values, fileContents);
  // write out the contents to the response
  response.write(fileContents);
}

function viewCSS (templateName, values, response) {
  var fileContents = fs.readFileSync('./assets/' + templateName, {encoding: "utf8"});
  response.write(fileContents);
} 

module.exports.viewHTML = viewHTML;
module.exports.viewCSS = viewCSS;