/*!***************************************
 * Level Up GHL Chat Tools
 * https//levelupghl.com
 * Version: v1.0.2
 ****************************************/

(function (exports) {
  'use strict';

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
  const CHAT_EMBED_CONTAINER_SELECTOR = "#levelup-chat-embed";
  const GHL_CHAT_WIDGET_SELECTOR = "chat-widget";
  function waitForChatLoad() {
    return __async(this, null, function* () {
      return new Promise((resolve) => {
        const handler = (event) => {
          resolve();
          window.removeEventListener("LC_chatWidgetLoaded", handler);
        };
        window.addEventListener("LC_chatWidgetLoaded", handler, false);
      });
    });
  }
  const embedChat = (containerSelector) => __async(void 0, null, function* () {
    var _a, _b, _c;
    const selector = containerSelector || CHAT_EMBED_CONTAINER_SELECTOR;
    const embedDiv = document.querySelector(selector);
    if (!embedDiv) {
      console.error(
        `embedChat: "${selector}" not found on page: unable to embed GHL chat widget`
      );
      return;
    }
    if (!((_b = (_a = window.leadConnector) == null ? void 0 : _a.chatWidget) == null ? void 0 : _b.isLoaded)) {
      yield waitForChatLoad();
    }
    const chat = document.querySelector(GHL_CHAT_WIDGET_SELECTOR);
    const root = chat == null ? void 0 : chat.shadowRoot;
    if (!chat || !root) {
      console.error(
        `embedChat: unable to find GHL chat widget on page`
      );
      return;
    }
    const button = root.querySelector(".lc_text-widget--btn");
    const widget = root.querySelector(".lc_text-widget");
    const box = root.querySelector(".lc_text-widget--box");
    const heading = root.querySelector(
      ".lc_text-widget_heading--root"
    );
    if (!button || !widget || !box || !heading) {
      console.error(`embedChat: unable to embed GHL chat widget in page: widget components not found`);
      return;
    }
    (_c = chat.parentElement) == null ? void 0 : _c.removeChild(chat);
    widget.style.position = "static";
    widget.style.width = "100%";
    box.style.maxWidth = "100%";
    button.style.display = "none";
    embedDiv.appendChild(chat);
    window.leadConnector.chatWidget.openWidget();
  });

  exports.embedChat = embedChat;

  return exports;

})({});
//# sourceMappingURL=embedChat.js.map
