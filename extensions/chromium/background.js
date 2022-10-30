let cacheData = null;

chrome.omnibox.setDefaultSuggestion({
  description: '[cmd.ms] Enter command (e.g. az)',
});

chrome.omnibox.onInputStarted.addListener(() => {
  loadCommandsToCache();
});

chrome.omnibox.onInputEntered.addListener((text) => {
  let cmd = '';
  if (text.length != 0) {
    cmd = text.trim() + '.';
  }
  let newURL = 'https://' + cmd + 'cmd.ms/';
  chrome.tabs.update({ url: newURL });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  if (text.length == 0) {
    suggest([]);

    return;
  }

  if (cacheData != null) {
    showAuto(cacheData, text, suggest);
  } else {
    fetch('https://cmd.ms/commands.json')
      .then((response) => response.json())
      .then((data) => {
        cacheData = data;
        showAuto(cacheData, text, suggest);
      });
  }
});

function showAuto(data, text, suggest) {
  if (!data.length) {
    suggest([]);
  } else {
    let sugsP1 = [];
    let sugsP2 = [];
    let sugsP3 = [];
    let sugsP4 = [];
    let inputText = text.toLowerCase();

    data.forEach((element) => {
      let command = element.command.toLowerCase();
      if (command === inputText) {
        var topHit = getCommand(element.command, element);
        sugsP1.push(topHit);
      } else if (command.startsWith(inputText)) {
        sugsP2.push(getCommand(element.command, element));
      } else if (command.includes(inputText)) {
        sugsP3.push(getCommand(element.command, element));
      } else if (
        element.description.toLowerCase().includes(inputText) ||
        element.keywords.toLowerCase().includes(inputText)
      ) {
        sugsP4.push(getCommand(element.command, element));
      }
    });

    let allSug = sugsP1.concat(sugsP2).concat(sugsP3).concat(sugsP4);

    suggest(allSug);
  }
}

function getCommand(cmd, element) {
  let formattedDescription = getFormattedDescription(cmd);
  return {
    content: ` ${cmd}`,
    deletable: true,
    description: `${formattedDescription}.cmd.ms - ${element.description} (${element.category}) > ${element.url}`,
  };
}

function loadCommandsToCache() {
  fetch('https://cmd.ms/commands.json')
    .then((response) => response.json())
    .then((data) => {
      cacheData = data;
    });
}

/*********** Browser Specific Code: BEGIN ************************/

function getFormattedDescription(cmd) {
  return `<match>${cmd}</match>`;
}

/*********** Browser Specific Code: END ************************/
