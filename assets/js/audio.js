/* Peppa English — bundled neural voice clips with SpeechSynthesis fallback. */
(function () {
  "use strict";

  var current = null;
  var cache = {};

  function stop() {
    if (current) {
      try { current.pause(); } catch (err) { /* ignore */ }
      current = null;
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (err) { /* ignore */ }
    }
  }

  function clipPath(id, kind, accent) {
    return "assets/audio/" + id + "-" + kind + "-" + (accent === "US" ? "us" : "uk") + ".mp3";
  }

  function warm(id, accent) {
    if (!id || typeof window.Audio !== "function") return;
    var acc = accent === "US" ? "US" : "UK";
    var path = clipPath(id, "s", acc);
    if (cache[path]) return;
    var audio = new window.Audio();
    audio.preload = "auto";
    audio.src = path;
    audio.onerror = function () { delete cache[path]; };
    audio.load();
    cache[path] = audio;
  }

  function play(opts) {
    if (!opts || !opts.id || typeof window.Audio !== "function") return false;
    stop();

    var path = clipPath(opts.id, opts.kind, opts.accent);
    var audio = cache[path] || new window.Audio(path);
    delete cache[path];
    audio.preload = "auto";
    audio.preservesPitch = true;
    audio.playbackRate = opts.slow ? 0.8 : 1;

    var failed = false;
    function state(name) {
      if (typeof opts.onstate === "function") {
        try { opts.onstate(name); } catch (err) { /* ignore */ }
      }
    }
    function fail() {
      if (failed) return;
      failed = true;
      state("error");
      if (opts.fallback) opts.fallback();
    }

    audio.addEventListener("playing", function () { state("playing"); });
    audio.onerror = function () {
      /* The media element itself failed to load; only then use TTS. */
      fail();
    };
    current = audio;
    state("loading");
    var promise = audio.play();
    if (promise && promise.then) {
      promise.then(function () {
        state("playing");
      }, function (err) {
        var name = err && err.name;
        /* A new clip stops the previous one; that aborts its play() promise. */
        if (name === "NotAllowedError" || name === "AbortError") return;
        fail();
      });
    }
    return true;
  }

  window.PE_AUDIO = {
    play: play,
    warm: warm,
    stop: stop,
    path: clipPath,
    current: function () { return current; }
  };
})();
