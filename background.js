let res_message = null;
let running_status = false;
let searchkeyword = '';
let locale = 'th';
let language = 'en';
let interval = 5;

const log_message = (message) => {
  let log_message = `${new Date().toLocaleTimeString()} - ${message}`;
  console.log(log_message);

  chrome.storage.sync.set({ "message": log_message }, function() {
  });
};

const product_check = (locale, language, keyword, interval, obj) => {
  log_message("Product checking...");
  if (obj.s === 200) {
    let product_objs = obj.b;
    if (product_objs.total > 0) {
      log_message(`Product checking : product found (${product_objs.total})`);
      let product_item_objs = product_objs.products.items;
      product_item_objs = product_item_objs.slice(0, 1);
      for (var product_item_obj of product_item_objs) {
        let result_uri = `/${locale}/${language}${product_item_obj.url}`;

        log_message(`Product uri : <a href="https://hermes.com${result_uri}" target="_blank">${result_uri}</a>`);

        chrome.storage.sync.set({ "uriResults": result_uri }, function() {
        });

        chrome.storage.sync.set({ "scripthandle": true }, function() {
          console.log('interval is set to True');
        });
      }
    } else {
      log_message(`Product checking : product not found`);

      setTimeout(() => {
        product_call(locale, language, keyword, interval);
      }, interval * 1000);
    }
  } else {
    log_message(`Product checking : something went wrong!`);
    chrome.storage.sync.set({ "scripthandle": true }, function() {
      console.log('interval is set to True');
    });
  }
};

const product_call = (locale, language, keyword, interval) => {
  if (running_status) {
    fetch(
      `https://www.hermes.com/${locale}/${language}/search/?s=${encodeURIComponent(
        keyword
      )}#|`
    )
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Something went wrong.");
      })
      .then((body) => {
        let parser = new DOMParser();

        let document = parser.parseFromString(body, "text/html");
        let hermes_state = document.getElementById(`hermes-state`);
        let hermes_state_object = JSON.parse(hermes_state.innerHTML);

        for (const [key, value] of Object.entries(hermes_state_object)) {
          if (key.includes("3902308812")) {
            product_check(locale, language, keyword, interval, value);
            break;
          }
        }
      })
      .catch((error) => {
        log_message(error);
        chrome.storage.sync.set({ "scripthandle": true }, function() {
          console.log('interval is set to True');
        });
      });
  } else {
    log_message(`Script Stopped`);
    chrome.storage.sync.set({ "scripthandle": true }, function() {
      console.log('interval is set to True');
    });
  }
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'scripthandle') {
      console.log('fromeTrigger ', newValue);
      if (newValue === 'true' || newValue) {
        running_status = false;
      } else {
        running_status = true;

        chrome.storage.sync.get("searchkeyword", function(result) {
          searchkeyword = result.searchkeyword || ""
        });

        chrome.storage.sync.get("locale", function(result) {
          locale = result.locale || ""
        });

        chrome.storage.sync.get("language", function(result) {
          language = result.language || ""
        });

        chrome.storage.sync.get("interval", function(result) {
          interval = result.interval || ""
        });

        setTimeout(e => {
          product_call(locale, language, searchkeyword, interval);
        }, 1000);
      }
    }
  }
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === "change_input") {
    chrome.storage.sync.set({ "automate": false }, function() {
    });
  }
});