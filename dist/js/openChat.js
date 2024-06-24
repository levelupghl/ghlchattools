/*!***************************************
 * Level Up GHL Chat Tools
 * https//levelupghl.com
 * Version: v1.0.8
 ****************************************/

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
function openWhenChatLoads() {
  return __async(this, null, function* () {
    return new Promise((resolve) => {
      const handler = (event) => {
        resolve();
        window.removeEventListener("LC_chatWidgetLoaded", handler);
        openChatWidget();
      };
      window.addEventListener("LC_chatWidgetLoaded", handler, false);
    });
  });
}
function addListeners(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      openChatWidget();
    });
  });
}
function openChatWidget() {
  window.leadConnector.chatWidget.openWidget();
}
const openChat = (autoOpen = true, elemSelector) => {
  var _a, _b;
  if (autoOpen) {
    if (!((_b = (_a = window.leadConnector) == null ? void 0 : _a.chatWidget) == null ? void 0 : _b.isLoaded)) {
      openWhenChatLoads();
    } else {
      openChatWidget();
    }
  }
  if (elemSelector) {
    document.addEventListener("hydrationDone", () => {
      addListeners(elemSelector);
    });
    addListeners(elemSelector);
  }
};

export { openChat };
//# sourceMappingURL=openChat.js.map
