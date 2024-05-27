# GHL Chat Tools

[Level Up](https://levelupghl.com)

GHL chat tools

# Documentation

- [Web Chat Widget](https://help.gohighlevel.com/support/solutions/articles/48001191051-web-chat-widget-advanced-configurations-public-api-events) - High Level guide


# Usage

```html
<div id="levelup-chat-embed"></div>
<script type="module">
  import { embedChat } from "https://cdn.jsdelivr.net/gh/levelupghl/ghlchattools@v1/dist/js/embedChat.min.js";
  embedChat("#levelup-chat-embed");
</script>
```

# Development & Deployment

```bash
# Update version
npm version patch

# Rebuild and deploy
npm run deploy
```

