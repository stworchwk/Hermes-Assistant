let searchkeywordInput = document.getElementById("hma-search_keyword")
let localeInput = document.getElementById("hma-locale_code")
let languageInput = document.getElementById("hma-language_code")
let intervalNumberInput = document.getElementById("hma-interval_number")
let msaHandleEle = document.getElementById("msa-handle");
let hmaMessage = document.getElementById("hma-message");
let hmaAutomate = document.getElementById("hma-automate");
let hmaEmail = document.getElementById("hma-email");
let hmaPassword = document.getElementById("hma-password");

const buttonHandler = () => {
  chrome.storage.sync.get("scripthandle", function (result) {
    if (!result.scripthandle && result.scripthandle !== undefined) {
      msaHandleEle.classList.remove("hma-btn-start");
      msaHandleEle.classList.add('hma-btn-stop');
      msaHandleEle.innerHTML = 'Stop';
      msaHandleEle.dataset.status = false;

      hmaMessage.style.display = 'block';
    } else {
      msaHandleEle.classList.remove("hma-btn-stop");
      msaHandleEle.classList.add('hma-btn-start');
      msaHandleEle.innerHTML = 'Start';
      msaHandleEle.dataset.status = true;
    }
  });
}

// ================= frist open popup setting ================================
console.log("Open popop");

chrome.storage.sync.get("searchkeyword", function (result) {
  if (result.searchkeyword === undefined) {
    searchkeywordInput.value = "Rocking";

    chrome.storage.sync.set({
      "searchkeyword": 'Rocking'
    }, function () {});

  } else {
    searchkeywordInput.value = result.searchkeyword || "";
  }
});

chrome.storage.sync.get("locale", function (result) {
  if (result.locale === undefined) {
    localeInput.value = "th";

    chrome.storage.sync.set({
      "locale": 'th'
    }, function () {});
  } else {
    localeInput.value = result.locale || ""
  }
});

chrome.storage.sync.get("language", function (result) {
  if (result.language === undefined) {
    languageInput.value = "en";

    chrome.storage.sync.set({
      "language": 'en'
    }, function () {});
  } else {
    languageInput.value = result.language || ""
  }
});

chrome.storage.sync.get("interval", function (result) {
  if (result.interval === undefined) {
    intervalNumberInput.value = 5;

    chrome.storage.sync.set({
      "interval": 5
    }, function () {});
  } else {
    intervalNumberInput.value = result.interval || ""
  }
});

chrome.storage.sync.get("automate", function (result) {
  if (result.automate === undefined) {
    hmaAutomate.checked = true;

    chrome.storage.sync.set({
      "automate": true
    }, function () {});
  } else {
    hmaAutomate.checked = result.automate || false
  }
});

chrome.storage.sync.get("email", function (result) {
  if (result.email === undefined) {
    hmaEmail.value = "";

    chrome.storage.sync.set({
      "email": ''
    }, function () {});
  } else {
    hmaEmail.value = result.email || ""
  }
});

chrome.storage.sync.get("password", function (result) {
  if (result.password === undefined) {
    hmaPassword.value = "";

    chrome.storage.sync.set({
      "password": ''
    }, function () {});
  } else {
    hmaPassword.value = result.password || ""
  }
});

buttonHandler();

// ===========================================================================
// ======================= On value some input Change ========================
searchkeywordInput.onchange = (e) => {
  const value = e.target.value
  chrome.storage.sync.set({
    "searchkeyword": value
  }, function () {
    console.log('searchkeyword is set to ' + value);
  });
}
localeInput.onchange = (e) => {
  const value = e.target.value
  chrome.storage.sync.set({
    "locale": value
  }, function () {
    console.log('locale is set to ' + value);
  });
}
languageInput.onchange = (e) => {
  const value = e.target.value
  chrome.storage.sync.set({
    "language": value
  }, function () {
    console.log('language is set to ' + value);
  });
}
intervalNumberInput.onchange = (e) => {
  const value = e.target.value
  chrome.storage.sync.set({
    "interval": value
  }, function () {
    console.log('interval is set to ' + value);
  });
}

hmaAutomate.onchange = (e) => {
  const value = e.target.checked
  chrome.storage.sync.set({
    "automate": value
  }, function () {
    console.log('automate is set to ' + value);
  });
}

hmaEmail.onchange = (e) => {
  const value = e.target.value
  chrome.storage.sync.set({
    "email": value
  }, function () {
    console.log('email is set to ' + value);
  });
}

hmaPassword.onchange = (e) => {
  const value = e.target.value
  chrome.storage.sync.set({
    "password": value
  }, function () {
    console.log('password is set to ' + value);
  });
}

msaHandleEle.onclick = (e) => {
  if (e.target.dataset.status === 'true' && e.target.dataset.status) {
    chrome.storage.sync.set({
      "scripthandle": false
    }, function () {
      console.log('interval is set to False');
    });

    chrome.storage.sync.set({
      "message": 'Script starting'
    }, function () {});

    chrome.storage.sync.set({
      "uriResults": null
    }, function () {});

    e.target.dataset.status = false;
  } else {
    chrome.storage.sync.set({
      "scripthandle": true
    }, function () {
      console.log('interval is set to True');
    });

    chrome.storage.sync.set({
      "message": 'Script stopping'
    }, function () {});
    e.target.dataset.status = true;
  }

  buttonHandler();
}

// =============================================================================================
// ================================ Re-Check storage change ====================================
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, {
      oldValue,
      newValue
    }] of Object.entries(changes)) {

    if (key === 'scripthandle') {
      buttonHandler();
    } else if (key === 'message') {
      hmaMessage.innerHTML = '............................................';
      setTimeout(() => {
        hmaMessage.innerHTML = newValue;
      }, 500);
    } else if (key === 'uriResults') {
      if (newValue !== undefined && newValue !== null) {
        hmaMessage.style.backgroundColor = '#0d6efd';
        product_automate(newValue);
      } else {
        hmaMessage.style.backgroundColor = 'rgb(82, 82, 82)';
      }
    } else if (key === 'automate') {
      hmaAutomate.checked = newValue || false
    }
  }
})
// =============================================================================================

const product_automate = (url) => {
  chrome.tabs.create({
    url: `https://hermes.com${url}`
  }, tab => {
    chrome.tabs.executeScript(tab.id, {
      file: 'content.js'
    });
  });
};