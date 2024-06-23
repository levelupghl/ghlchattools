/*!***************************************
 * Level Up GHL Chat Tools
 * https//levelupghl.com
 * Version: v1.0.7
 ****************************************/

function isMobileBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor;
  const mobileAgents = [
    /android/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /opera mini/i,
    /iemobile/i,
    /mobile/i
  ];
  return mobileAgents.some((mobileAgent) => mobileAgent.test(userAgent));
}
function browserHeightLessThan(maxHeight) {
  const currentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return currentHeight < maxHeight;
}
function scrollToElement(elem, scrollOffset = 0) {
  const elementPosition = elem.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - scrollOffset;
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
}

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
const CHAT_EMBED_CONTAINER_SELECTOR = "#ghl-chat-embed";
const GHL_CHAT_WIDGET_SELECTOR = "chat-widget";
const DEFAULT_OPTIONS = {
  maxHeight: 650,
  autoScroll: false,
  scrollOffset: 20
};
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
function getOptions(options) {
  const opts = __spreadValues({}, DEFAULT_OPTIONS);
  if (!options) {
    return opts;
  }
  try {
    if (options.maxHeight) {
      opts.maxHeight = typeof options.maxHeight === "number" ? options.maxHeight : parseInt(options.maxHeight);
    }
    if (options.autoScroll) {
      opts.autoScroll = true;
      if (options.scrollOffset) {
        opts.scrollOffset = typeof options.scrollOffset === "number" ? options.scrollOffset : parseInt(options.scrollOffset);
      }
    }
  } catch (err) {
    console.error(`embedChat: invalid options, using defaults`);
  }
  return opts;
}
const embedChat = (containerSelector, options) => __async(void 0, null, function* () {
  var _a, _b, _c;
  const selector = containerSelector || CHAT_EMBED_CONTAINER_SELECTOR;
  const opts = getOptions(options);
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
  if (isMobileBrowser() || browserHeightLessThan(opts.maxHeight)) {
    return window.leadConnector.chatWidget.openWidget();
  }
  const chat = document.querySelector(GHL_CHAT_WIDGET_SELECTOR);
  const root = chat == null ? void 0 : chat.shadowRoot;
  if (!chat || !root) {
    console.error(`embedChat: unable to find GHL chat widget on page`);
    return;
  }
  const button = root.querySelector(".lc_text-widget--btn");
  const widget = root.querySelector(".lc_text-widget");
  const box = root.querySelector(".lc_text-widget--box");
  const heading = root.querySelector(
    ".lc_text-widget_heading--root"
  );
  if (!button || !widget || !box || !heading) {
    console.error(
      `embedChat: unable to embed GHL chat widget in page: widget components not found`
    );
    return;
  }
  (_c = chat.parentElement) == null ? void 0 : _c.removeChild(chat);
  widget.style.position = "static";
  widget.style.width = "100%";
  box.style.maxWidth = "100%";
  button.style.display = "none";
  embedDiv.appendChild(chat);
  window.leadConnector.chatWidget.openWidget();
  if (opts.autoScroll) {
    setTimeout(() => {
      scrollToElement(embedDiv, opts.scrollOffset);
    }, 100);
  }
});

export { embedChat };
//# sourceMappingURL=embedChat.js.map
