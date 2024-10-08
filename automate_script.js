const simulate = (element, eventName) => {
  var options = extend(defaultOptions, {});
  var oEvent,
    eventType = null;

  for (var name in eventMatchers) {
    if (eventMatchers[name].test(eventName)) {
      eventType = name;
      break;
    }
  }

  if (!eventType)
    throw new SyntaxError(
      "Only HTMLEvents and MouseEvents interfaces are supported"
    );

  if (document.createEvent) {
    oEvent = document.createEvent(eventType);
    if (eventType == "HTMLEvents") {
      oEvent.initEvent(eventName, options.bubbles, options.cancelable);
    } else {
      oEvent.initMouseEvent(
        eventName,
        options.bubbles,
        options.cancelable,
        document.defaultView,
        options.button,
        options.pointerX,
        options.pointerY,
        options.pointerX,
        options.pointerY,
        options.ctrlKey,
        options.altKey,
        options.shiftKey,
        options.metaKey,
        options.button,
        element
      );
    }
    element.dispatchEvent(oEvent);
  } else {
    options.clientX = options.pointerX;
    options.clientY = options.pointerY;
    var evt = document.createEventObject();
    oEvent = extend(evt, options);
    element.fireEvent("on" + eventName, oEvent);
  }
  return element;
};

const extend = (destination, source) => {
  for (var property in source) destination[property] = source[property];
  return destination;
};

var eventMatchers = {
  HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
  MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
};
var defaultOptions = {
  pointerX: 0,
  pointerY: 0,
  button: 0,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  bubbles: true,
  cancelable: true,
};

const viewcart_element_checking = (e) => {
  let viewcart_element = document.querySelectorAll('button[name="view-cart"]');
  if (viewcart_element.length > 0) {
    simulate(viewcart_element[0], "click");
  } else {
    setTimeout(() => {
      viewcart_element_checking();
    }, 100);
  }
};

const add_cart_element_checking = (e) => {
  let add_cart_element = document.querySelectorAll(
    'form.simple-product-selector button[name="add-to-cart"]'
  );
  if (add_cart_element.length > 0) {
    let add_cart_element_item = add_cart_element[0];
    if (add_cart_element_item.querySelector('.button-content-container') === null) {
      setTimeout(() => {
        add_cart_element_checking();
      }, 100);
    } else {
      simulate(add_cart_element[0], "click");
      viewcart_element_checking();
    }
  } else {
    setTimeout(() => {
      add_cart_element_checking();
    }, 100);
  }
};

const checkout_cart_element_checking = (e) => {
  let checkout_cart_element = document.querySelectorAll(
    'button[name="undefined"][data-testid="Checkout"]'
  );
  if (checkout_cart_element.length > 0) {
    simulate(checkout_cart_element[0], "click");
  } else {
    setTimeout(() => {
      checkout_cart_element_checking();
    }, 100);
  }
};

const submit_checkout_checking = (e) => {
  let submit_checkout_element = document.querySelectorAll('button[type="submit"][name="undefined"]');
  if (submit_checkout_element.length > 0) {
    simulate(submit_checkout_element[0], "click");
  } else {
    setTimeout(() => {
      submit_checkout_checking();
    }, 100);
  }
}

const accept_checkbox_checking = (e) => {
  let accept_checkbox_element = document.querySelectorAll('#checkbox-gtc-checkbox');
  if (accept_checkbox_element.length > 0) {
    simulate(accept_checkbox_element[0], "click");

    submit_checkout_checking();
  } else {
    setTimeout(() => {
      accept_checkbox_checking();
    }, 100);
  }
}

const checkout_order_element_checking_click = () => {
  let checkout_order_element = document.querySelectorAll('button[name="undefined"][data-testid="See order details"]');
  if (checkout_order_element.length > 0) {
    simulate(checkout_order_element[0], "click");
    setTimeout(() => {
      checkout_order_element_checking_click();
    }, 100)
  } else {
    accept_checkbox_checking();
  }
}

const checkout_order_element_checking = (e) => {
  let checkout_order_element = document.querySelectorAll('button[name="undefined"][data-testid="See order details"]');
  if (checkout_order_element.length > 0) {
    console.log(checkout_order_element);
    simulate(checkout_order_element[0], "click");
    checkout_order_element_checking_click()
  } else {
    setTimeout(() => {
      checkout_order_element_checking();
    }, 100);
  }
};

const checkout_submit_login_password_element_checking_click = (e) => {
  let checkout_submit_login_element = document.querySelectorAll('button[type="submit"][name="continue"]');
  if (checkout_submit_login_element.length > 0) {
    simulate(checkout_submit_login_element[0], "click");
    setTimeout(() => {
      checkout_submit_login_password_element_checking_click();
    }, 100);
  }
}

const checkout_submit_login_password_element_checking = (e) => {
  let loginPasswordInputEle = document.getElementById('password');
  if (loginPasswordInputEle !== null) {
    chrome.storage.sync.get("password", function (result) {
      if (result.password !== "") {
        loginPasswordInputEle.value = result.password || "";
        loginPasswordInputEle.dispatchEvent(
          new Event("input", {
            bubbles: true,
            cancelable: true
          })
        );
      }

      checkout_submit_login_password_element_checking_click();
    });

  } else {
    setTimeout(() => {
      checkout_submit_login_password_element_checking();
    }, 100);
  }
}

const checkout_login_email_element_checking_click = (e) => {
  let checkout_login_element = document.querySelectorAll('button[name="sign or log in"]');
  if (checkout_login_element.length > 0) {
    simulate(checkout_login_element[0], "click");
    setTimeout(() => {
      checkout_login_email_element_checking_click();
    }, 100);
  } else {
    setTimeout(() => {
      checkout_submit_login_password_element_checking();
    }, 100);
  }
}



const checkout_login_email_element_checking = (e) => {
  let loginEmailInputEle = document.getElementById('email');
  if (loginEmailInputEle !== null) {

    chrome.storage.sync.get("email", function (result) {
      if (result.email !== "") {
        loginEmailInputEle.value = result.email || "";
        loginEmailInputEle.dispatchEvent(
          new Event("input", {
            bubbles: true,
            cancelable: true
          })
        );
      }
      setTimeout(() => {
        checkout_login_email_element_checking_click();
      }, 100);
    });
  } else {
    setTimeout(() => {
      checkout_login_email_element_checking();
    }, 100);
  }
}

window.addEventListener(
  "load",
  () => {
    chrome.storage.sync.get("automate", function (result) {
      if (result.automate) {
        let current_uri = window.location.href;
        if (current_uri.includes("/product")) {
          console.log('Product');
          add_cart_element_checking();
          checkout_cart_element_checking();
          checkout_login_email_element_checking();
          checkout_order_element_checking();
        } else if (current_uri.includes("/cart")) {
          console.log('Cart');
          checkout_order_element_checking();
          checkout_cart_element_checking();
          checkout_login_email_element_checking();
        } else if (current_uri.includes("/checkout")) {
          console.log('Checkout');
          checkout_order_element_checking();
        } else if (current_uri.includes("/checkout/login")) {
          console.log('Checkout Login');
          checkout_login_email_element_checking();
        }
      }
    });
  },
  false
);

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, {
      oldValue,
      newValue
    }] of Object.entries(changes)) {
    if (key === 'automate') {
      window.location.reload();
    }
  }
});