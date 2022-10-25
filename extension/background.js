chrome.omnibox.setDefaultSuggestion({
  description:
    "Browse to https://cmd.ms for the full command list. (try <match>ad</match>)",
});

chrome.omnibox.onInputEntered.addListener((text) => {
  var newURL = "https://" + text + ".cmd.ms/";
  chrome.tabs.update({ url: newURL });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  fetch('http://www.colourlovers.com/api/color/' + text + '?format=json')
    .then((response) => response.json())
    .then((data) => {
    	if (!data.length) {
            //no color was found
            suggest([]);
        } else {
            //TODO send suggestion when color exists
        }
})

  if(text.includes('a')){
    suggest([
      {
          content: `adca`,
          deletable: true,
          description: `<match>adca</match> - Azure AD - Conditional Access`
      }
    ])
  }
  else{
  }
});
