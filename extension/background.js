chrome.omnibox.onInputEntered.addListener((text) => {
  var newURL = "https://" + text + ".cmd.ms/";
  chrome.tabs.update({ url: newURL });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  if(text.length == 0){
    suggest([]);
    return;
  }

  fetch('https://cmd.ms/commands.json')
    .then((response) => response.json())
    .then((data) => {
    	if (!data.length) {
            //no color was found
            suggest([]);
      } else {
        let sugsP1 = [];
        let sugsP2 = [];
        let sugsP3 = [];
        let sugsP4 = [];
        inputText = text.toLowerCase();

        console.log(text);
        data.forEach(element => {
          command = element.command.toLowerCase();
          if(command === inputText){
            var topHit = getCommand(element.command, element);
            sugsP1.push(topHit);
          } else if(command.startsWith(inputText)){
            sugsP2.push(getCommand(element.command, element));
          } else if(command.includes(inputText)){
            sugsP3.push(getCommand(element.command, element));
          } else if (element.description.toLowerCase().includes(inputText) || element.keywords.toLowerCase().includes(inputText)){
            sugsP4.push(getCommand(element.command, element));
          }
          element.alias.split(',').forEach(aliasItem => {
            
          });
        });

        let allSug = sugsP1.concat(sugsP2).concat(sugsP3).concat(sugsP4);
        console.log(allSug);
        suggest(allSug);
        chrome.omnibox.setDefaultSuggestion({description:"Go to %s.cmd.ms"})
        if(allSug.length > 0){
          if(allSug[0].content === inputText){
            chrome.omnibox.setDefaultSuggestion({description: allSug[0].description});
          }
        }  
      }
    })
});

function getCommand(cmd, element){
  return {
    content: `${cmd}`,
    deletable: true,
    description: `<match>${cmd}</match>.cmd.ms - ${element.description} (${element.category}) > ${element.url}`
  }
}
