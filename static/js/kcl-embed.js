(function () {
  'use strict';

  var KCL_ORIGINS = {
    'https://kclhq.com': true,
    'https://www.kclhq.com': true,
    'http://localhost:3000': true
  };

  function isEmbedMessage(event) {
    return KCL_ORIGINS[event.origin] &&
      event.data &&
      event.data.source === 'kcl-kpopface-embed';
  }

  function isLocalHost() {
    return window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0' ||
      window.location.hostname === '[::1]';
  }

  function getEmbedUrl(frame) {
    if (isLocalHost()) {
      return frame.getAttribute('data-kcl-embed-local-src');
    }

    return frame.getAttribute('data-kcl-embed-src');
  }

  function init() {
    var frames = document.querySelectorAll('[data-kcl-embed-frame]');
    if (!frames.length) return;

    Array.prototype.forEach.call(frames, function (frame) {
      frame.style.height = '340px';
      var embedUrl = getEmbedUrl(frame);
      if (embedUrl) frame.src = embedUrl;
    });

    window.addEventListener('message', function (event) {
      if (!isEmbedMessage(event)) return;

      Array.prototype.forEach.call(frames, function (frame) {
        if (frame.contentWindow !== event.source) return;

        if (event.data.type === 'resize') {
          var height = Number(event.data.height);
          if (Number.isFinite(height)) {
            frame.style.height = Math.max(280, Math.min(height + 2, 900)) + 'px';
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
