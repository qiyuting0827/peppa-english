/* Peppa English — router, shell, speech and interactions */
(function () {
  'use strict';

  var DATA = window.PE_DATA;
  var STORE = window.PE_STORE;
  var VIEWS = window.PE_VIEWS;

  var app = {
    route: 'home',
    browse: { q: '', season: 'all', status: 'all', limit: 60 },
    study: null
  };

  var lastHash = null;
  var toastTimer = null;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function parseHash() {
    var hash = window.location.hash || '#/';
    var qAt = hash.indexOf('?');
    var path = (qAt >= 0 ? hash.slice(0, qAt) : hash).replace(/\/+$/, '');
    if (!path) path = '#';
    var params = {};
    if (qAt >= 0) {
      hash.slice(qAt + 1).split('&').forEach(function (part) {
        if (!part) return;
        var eq = part.indexOf('=');
        var k = decodeURIComponent(eq >= 0 ? part.slice(0, eq) : part);
        var v = decodeURIComponent(eq >= 0 ? part.slice(eq + 1) : '');
        params[k] = v;
      });
    }
    var name = 'home';
    if (path === '#/study') name = 'study';
    else if (path === '#/browse') name = 'browse';
    else if (path === '#/stats') name = 'stats';
    else if (path === '#/resources') name = 'resources';
    else if (path !== '#' && path !== '#/' && path !== '#/home') name = 'home';
    return { name: name, params: params };
  }

  function toast(message) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove('show');
    }, 2200);
  }

  function findItem(id) {
    for (var i = 0; i < DATA.items.length; i++) {
      if (DATA.items[i].id === id) return DATA.items[i];
    }
    return null;
  }

  function setBodyRoute(name) {
    document.body.setAttribute('data-route', name);
    document.body.classList.toggle('route-study', name === 'study');
  }

  function renderApp(html, opts) {
    opts = opts || {};
    var appEl = $('#app');
    var y = window.pageYOffset;
    appEl.innerHTML = html;
    if (opts.keepScroll) window.scrollTo(0, y);
    else window.scrollTo(0, 0);
  }

  /* ------------------------------- STUDY ------------------------------- */

  function newStudyState(item, queue, single) {
    var settings = STORE.getSettings();
    return {
      item: item || null,
      queue: queue || [],
      idx: 0,
      total: (queue || []).length,
      single: !!single,
      mode: 'listen',
      subtitle: settings.subtitle,
      slow: settings.slow,
      answer: '',
      checked: false,
      correct: false,
      revealed: false,
      playing: false,
      counts: STORE.getCounts()
    };
  }

  function enterStudy(itemId) {
    if (itemId) {
      var item = findItem(itemId);
      if (!item) {
        toast('没有找到这张卡片');
        window.location.hash = '#/browse';
        return false;
      }
      app.study = newStudyState(item, [item], true);
      return true;
    }
    var queue = STORE.buildQueue(20);
    app.study = newStudyState(queue[0] || null, queue, false);
    return true;
  }

  function studyViewState() {
    var st = app.study || newStudyState(null, [], false);
    st.counts = STORE.getCounts();
    return st;
  }

  function renderStudy(opts) {
    if (!app.study) return;
    app.study.counts = STORE.getCounts();
    if (app.study.item && window.PE_AUDIO && window.PE_AUDIO.warm) {
      window.PE_AUDIO.warm(app.study.item.id, defaultAccent());
    }
    renderApp(VIEWS.study(app.study), opts);
  }

  function resetCardFlags() {
    if (!app.study) return;
    app.study.answer = '';
    app.study.checked = false;
    app.study.correct = false;
    app.study.revealed = false;
    app.study.playing = false;
  }

  function advanceAfterRate() {
    var st = app.study;
    if (!st) return;
    if (st.single) {
      window.location.hash = '#/browse?season=' + st.item.season;
      return;
    }
    st.idx++;
    st.playing = false;
    if (st.idx >= st.queue.length) {
      st.item = null;
      st.total = st.queue.length;
      renderStudy();
      return;
    }
    st.item = st.queue[st.idx];
    resetCardFlags();
    renderStudy();
  }

  function rateCurrent(level) {
    var st = app.study;
    if (!st || !st.item) return;
    if (!st.revealed) {
      toast('先看答案，再选择记忆程度');
      return;
    }
    var labels = ['重来', '困难', '良好', '简单'];
    STORE.rate(st.item.id, level);
    toast('已记录 · ' + labels[level] + ' · 下一张');
    advanceAfterRate();
  }

  function checkAnswer() {
    var st = app.study;
    if (!st || !st.item) return;
    var input = $('#answer-input');
    if (input) st.answer = input.value;
    if (!String(st.answer || '').trim()) {
      if (input) {
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
        input.focus();
      }
      toast('先写下你听到的单词');
      return;
    }
    st.correct = normalize(st.answer) === normalize(st.item.word);
    st.checked = true;
    st.revealed = true;
    st.playing = false;
    renderStudy();
    window.setTimeout(scrollToRating, 80);
  }

  function revealCard() {
    var st = app.study;
    if (!st || !st.item || st.revealed) return;
    var input = $('#answer-input');
    if (input) st.answer = input.value;
    st.revealed = true;
    st.checked = false;
    renderStudy();
    window.setTimeout(scrollToRating, 80);
  }

  function scrollToRating() {
    var rate = $('.rate-wrap');
    if (!rate) return;
    var rect = rate.getBoundingClientRect();
    var safeBottom = window.innerHeight - 14;
    if (rect.bottom <= safeBottom) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var top = window.pageYOffset + rect.bottom - safeBottom + 14;

    /* Keep the answer feedback visible below the sticky study bar when possible. */
    var feedback = $('.feedback');
    var bar = $('.study-bar');
    if (feedback && bar) {
      var feedbackLimit = window.pageYOffset + feedback.getBoundingClientRect().top - bar.offsetHeight - 10;
      if (feedbackLimit > 0) top = Math.min(top, feedbackLimit);
    }
    top = Math.max(0, top);
    window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
  }

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[.!?,;:，。！？；：]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ------------------------------- SPEECH ------------------------------- */

  function accentLang(accent) {
    return accent === 'US' ? 'en-US' : 'en-GB';
  }

  function speak(text, accent, forceSlow) {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
      toast('当前浏览器不支持语音朗读');
      return;
    }
    var synth = window.speechSynthesis;
    try {
      synth.cancel();
      var utter = new window.SpeechSynthesisUtterance(String(text || ''));
      var lang = accentLang(accent).toLowerCase();
      utter.lang = accentLang(accent);
      utter.rate = forceSlow || (app.study && app.study.slow) ? 0.78 : 0.96;
      utter.pitch = 1;
      utter.volume = 1;
      var voices = synth.getVoices ? synth.getVoices() : [];
      var matches = [];
      var female = /aria|jenny|sonia|hazel|libby|michelle|samantha|serena|kate|stephanie|emma|olivia/i;
      for (var i = 0; i < voices.length; i++) {
        var vl = String(voices[i].lang || '').replace('_', '-').toLowerCase();
        if (vl !== lang && vl.indexOf(lang.slice(0, 5)) !== 0) continue;
        var name = String(voices[i].name || '');
        var score = vl === lang ? 4 : 1;
        if (/natural|neural|google/i.test(name)) score += 8;
        if (female.test(name)) score += 3;
        if (voices[i].localService === false) score += 1;
        matches.push({ voice: voices[i], score: score });
      }
      matches.sort(function (a, b) { return b.score - a.score; });
      if (matches.length) utter.voice = matches[0].voice;
      synth.speak(utter);
    } catch (err) {
      toast('语音播放失败，请检查浏览器设置');
    }
  }

  function currentSpeechText() {
    var st = app.study;
    if (!st || !st.item) return '';
    return st.item.sentence;
  }

  function defaultAccent() {
    return STORE.getSettings().voice === 'US' ? 'US' : 'UK';
  }

  var audioStateTimer = null;

  function setAudioState(state) {
    window.clearTimeout(audioStateTimer);
    var row = document.querySelector('.audio-row');
    if (state === 'loading') {
      audioStateTimer = window.setTimeout(function () {
        var liveRow = document.querySelector('.audio-row');
        document.body.classList.add('audio-loading');
        if (liveRow) liveRow.classList.add('is-loading');
      }, 300);
    } else {
      document.body.classList.remove('audio-loading');
      if (row) row.classList.remove('is-loading');
    }
  }

  function playItemAudio(kind, accent, forceSlow, text) {
    var st = app.study;
    if (!st || !st.item) {
      speak(text, accent, forceSlow);
      return;
    }
    var slow = !!forceSlow || (kind === 's' && !!st.slow);
    var fallback = function () { speak(text, accent, forceSlow); };
    if (window.PE_AUDIO && window.PE_AUDIO.play) {
      var started = window.PE_AUDIO.play({
        id: st.item.id,
        kind: kind,
        accent: accent,
        slow: slow,
        fallback: fallback,
        onstate: setAudioState
      });
      if (started) return;
    }
    fallback();
  }

  /* ------------------------------- BROWSE ------------------------------- */

  function updateBrowseResults() {
    var wrap = $('#browse-results-wrap');
    if (!wrap) return;
    wrap.innerHTML = VIEWS.browseRows(app.browse.q, app.browse.season, app.browse.status, app.browse.limit);
  }

  function updateSeasonScrollFade() {
    var scroller = $('#season-scroll');
    var wrap = $('#season-scroll-wrap');
    if (!scroller || !wrap) return;
    var atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 6;
    wrap.classList.toggle('at-end', atEnd);
  }

  function initSeasonScroll() {
    var scroller = $('#season-scroll');
    if (!scroller) return;
    updateSeasonScrollFade();
    scroller.addEventListener('scroll', updateSeasonScrollFade, { passive: true });
  }

  function syncBrowseChips() {
    $all('[data-season-filter]').forEach(function (btn) {
      btn.classList.toggle('active', String(app.browse.season) === btn.getAttribute('data-season-filter'));
    });
    $all('[data-status-filter]').forEach(function (btn) {
      btn.classList.toggle('active', app.browse.status === btn.getAttribute('data-status-filter'));
    });
  }

  /* ------------------------------- MODALS ------------------------------- */

  function openModal(html) {
    var root = $('#modal-root');
    root.innerHTML = '<div class="modal-overlay" data-action="modal-overlay"><div class="modal" role="dialog" aria-modal="true">' + html + '</div></div>';
    document.body.classList.add('modal-open');
    window.setTimeout(function () {
      var first = $('.modal .modal-close');
      if (first) first.focus();
    }, 30);
  }

  function closeModal() {
    $('#modal-root').innerHTML = '';
    document.body.classList.remove('modal-open');
  }

  function settingsModal() {
    var s = STORE.getSettings();
    openModal(
      '<div class="modal-head"><div><p class="overline">学习设置</p><h2>按自己的节奏来</h2></div><button class="modal-close" data-action="close-modal" aria-label="关闭">' + VIEWS.icon('close') + '</button></div>' +
      '<div class="modal-section"><p class="modal-label">默认发音</p><div class="seg">' +
        '<button data-setting="voice" data-value="UK" class="' + (s.voice === 'UK' ? 'active' : '') + '">英音 UK</button>' +
        '<button data-setting="voice" data-value="US" class="' + (s.voice === 'US' ? 'active' : '') + '">美音 US</button>' +
      '</div></div>' +
      '<div class="modal-section"><p class="modal-label">每日新词</p><div class="seg">' +
        [10, 20, 30].map(function (n) {
          return '<button data-setting="dailyNew" data-value="' + n + '" class="' + (s.dailyNew === n ? 'active' : '') + '">' + n + ' 张</button>';
        }).join('') +
      '</div><p class="modal-help">每天最多引入的新卡片数量。</p></div>' +
      '<div class="modal-section"><p class="modal-label">默认字幕</p><div class="seg">' +
        [{ k: 'none', t: '无字幕' }, { k: 'en', t: '英文字幕' }, { k: 'both', t: '双语' }].map(function (x) {
          return '<button data-setting="subtitle" data-value="' + x.k + '" class="' + (s.subtitle === x.k ? 'active' : '') + '">' + x.t + '</button>';
        }).join('') +
      '</div></div>' +
      '<div class="modal-section modal-row"><div><p class="modal-label">默认慢速</p><p class="modal-help">0.75×，适合精听。</p></div><button class="switch' + (s.slow ? ' on' : '') + '" data-setting="slow" data-value="' + (s.slow ? '0' : '1') + '" aria-pressed="' + s.slow + '"><i></i></button></div>' +
      '<div class="modal-actions"><button class="primary-btn" data-action="close-modal">完成</button><button class="danger-link" data-action="open-reset">重置学习进度</button></div>'
    );
  }

  function resetModal() {
    openModal(
      '<div class="modal-head"><div><p class="overline">重置进度</p><h2>清空所有学习记录？</h2></div><button class="modal-close" data-action="close-modal" aria-label="关闭">' + VIEWS.icon('close') + '</button></div>' +
      '<p class="modal-copy">所有卡片的记忆等级、复习时间和每日统计都会被清空。此操作不可撤销。</p>' +
      '<div class="modal-actions"><button class="danger-btn" data-action="do-reset">确认重置</button><button class="ghost-btn" data-action="close-modal">取消</button></div>'
    );
  }

  function afterReset() {
    closeModal();
    STORE.resetAll();
    toast('学习进度已重置');
    var route = parseHash();
    if (route.name === 'study') {
      var wasSingle = app.study && app.study.single;
      if (wasSingle && app.study.item) enterStudy(app.study.item.id);
      else enterStudy();
      renderStudy();
    } else {
      renderRoute(route, true);
    }
  }

  /* ------------------------------- ROUTER ------------------------------- */

  function renderRoute(route, force) {
    route = route || parseHash();
    app.route = route.name;
    setBodyRoute(route.name);
    document.body.classList.remove('modal-open');

    if (route.name === 'study') {
      var itemId = route.params.item || '';
      if (!enterStudy(itemId)) return;
      renderStudy();
      document.title = '精听学习 · Peppa English';
      return;
    }

    if (route.name === 'browse') {
      app.browse.q = '';
      app.browse.status = 'all';
      app.browse.limit = 60;
      var season = route.params.season;
      app.browse.season = season && /^(10|[1-9])$/.test(season) ? Number(season) : 'all';
      renderApp(VIEWS.browse(app.browse));
      initSeasonScroll();
      document.title = '词库 · Peppa English';
      return;
    }

    if (route.name === 'stats') {
      renderApp(VIEWS.stats());
      document.title = '学习统计 · Peppa English';
      return;
    }

    if (route.name === 'resources') {
      renderApp(VIEWS.resources());
      document.title = '学习资源 · Peppa English';
      return;
    }

    renderApp(VIEWS.home());
    document.title = '小猪佩奇英语精听 · Peppa English';
  }

  function onHashChange() {
    var hash = window.location.hash || '#/';
    if (hash === lastHash && !app.route) return;
    lastHash = hash;
    closeModal();
    renderRoute(parseHash(), true);
  }

  /* ------------------------------- EVENTS ------------------------------- */

  function onClick(event) {
    var overlay = event.target.closest ? event.target.closest('.modal-overlay') : null;
    if (overlay && event.target === overlay) {
      closeModal();
      return;
    }

    var speakBtn = event.target.closest('[data-speak]');
    if (speakBtn) {
      event.preventDefault();
      var accent = speakBtn.getAttribute('data-speak') || defaultAccent();
      var isWord = !!event.target.closest('.speak-mini');
      if (!app.study || !app.study.item) return;
      playItemAudio(isWord ? 'w' : 's', accent, false, isWord ? app.study.item.word : currentSpeechText());
      return;
    }

    var modeBtn = event.target.closest('[data-mode]');
    if (modeBtn && app.study) {
      var nextMode = modeBtn.getAttribute('data-mode');
      if (nextMode === app.study.mode) return;
      app.study.mode = nextMode;
      resetCardFlags();
      renderStudy({ keepScroll: true });
      return;
    }

    var subBtn = event.target.closest('[data-subtitle]');
    if (subBtn && app.study) {
      var val = subBtn.getAttribute('data-subtitle');
      if (val === app.study.subtitle) return;
      STORE.updateSettings({ subtitle: val });
      app.study.subtitle = val;
      renderStudy({ keepScroll: true });
      return;
    }

    var rateBtn = event.target.closest('[data-rate]');
    if (rateBtn) {
      rateCurrent(Number(rateBtn.getAttribute('data-rate')));
      return;
    }

    var seasonFilter = event.target.closest('[data-season-filter]');
    if (seasonFilter) {
      var sf = seasonFilter.getAttribute('data-season-filter');
      app.browse.season = sf === 'all' ? 'all' : Number(sf);
      app.browse.limit = 60;
      syncBrowseChips();
      updateBrowseResults();
      return;
    }

    var statusFilter = event.target.closest('[data-status-filter]');
    if (statusFilter) {
      app.browse.status = statusFilter.getAttribute('data-status-filter');
      app.browse.limit = 60;
      syncBrowseChips();
      updateBrowseResults();
      return;
    }

    var itemBtn = event.target.closest('[data-item]');
    if (itemBtn) {
      window.location.hash = '#/study?item=' + encodeURIComponent(itemBtn.getAttribute('data-item'));
      return;
    }

    var seasonCell = event.target.closest('[data-season]');
    if (seasonCell) {
      window.location.hash = '#/browse?season=' + encodeURIComponent(seasonCell.getAttribute('data-season'));
      return;
    }

    var settingBtn = event.target.closest('[data-setting]');
    if (settingBtn) {
      var key = settingBtn.getAttribute('data-setting');
      var value = settingBtn.getAttribute('data-value');
      var patch = {};
      if (key === 'dailyNew') patch.dailyNew = Number(value);
      else if (key === 'slow') patch.slow = value === '1';
      else patch[key] = value;
      STORE.updateSettings(patch);
      if (key === 'slow') {
        settingBtn.classList.toggle('on', !!patch.slow);
        settingBtn.setAttribute('aria-pressed', String(!!patch.slow));
        settingBtn.setAttribute('data-value', patch.slow ? '0' : '1');
        if (app.study) app.study.slow = !!patch.slow;
      } else {
        var group = settingBtn.parentNode;
        $all('[data-setting="' + key + '"]', group).forEach(function (b) {
          b.classList.toggle('active', b === settingBtn);
        });
        if (app.study && (key === 'subtitle')) app.study.subtitle = value;
      }
      if (app.route === 'study' && app.study) renderStudy({ keepScroll: true });
      toast('设置已保存');
      return;
    }

    var actionBtn = event.target.closest('[data-action]');
    if (!actionBtn) return;
    var action = actionBtn.getAttribute('data-action');

    if (action === 'close-modal' || action === 'modal-overlay') {
      closeModal();
    } else if (action === 'settings') {
      settingsModal();
    } else if (action === 'open-reset') {
      resetModal();
    } else if (action === 'do-reset') {
      afterReset();
    } else if (action === 'back') {
      if (app.study && app.study.single && app.study.item) window.location.hash = '#/browse?season=' + app.study.item.season;
      else window.location.hash = '#/';
    } else if (action === 'slow') {
      if (!app.study) return;
      app.study.slow = !app.study.slow;
      STORE.updateSettings({ slow: app.study.slow });
      actionBtn.classList.toggle('on', app.study.slow);
      actionBtn.setAttribute('aria-pressed', String(app.study.slow));
      toast(app.study.slow ? '慢速 0.75× 已开启' : '恢复正常速度');
    } else if (action === 'reveal') {
      revealCard();
    } else if (action === 'video') {
      if (!app.study || !app.study.item) return;
      var wrap = $('.scene-wrap');
      if (wrap) wrap.classList.add('playing');
      playItemAudio('s', defaultAccent(), false, app.study.item.sentence);
      toast('视频播放 · 跟读一遍吧');
    } else if (action === 'again') {
      var queue = STORE.buildQueue(20);
      if (!queue.length) {
        queue = DATA.items.slice().sort(function (a, b) {
          return STORE.getItemState(a.id).last - STORE.getItemState(b.id).last;
        }).slice(0, 20);
      }
      app.study = newStudyState(queue[0] || null, queue, false);
      renderStudy();
    } else if (action === 'more-rows') {
      app.browse.limit += 60;
      updateBrowseResults();
    } else if (action === 'clear-search') {
      var input = $('#browse-search');
      app.browse.q = '';
      app.browse.limit = 60;
      if (input) {
        input.value = '';
        input.focus();
      }
      var clear = $('.clear-btn');
      if (clear) clear.classList.remove('show');
      updateBrowseResults();
    }
  }

  function onInput(event) {
    if (event.target.id === 'browse-search') {
      app.browse.q = event.target.value;
      app.browse.limit = 60;
      updateBrowseResults();
      var clear = $('.clear-btn');
      if (clear) clear.classList.toggle('show', !!event.target.value);
    } else if (event.target.id === 'answer-input' && app.study) {
      app.study.answer = event.target.value;
    }
  }

  function onSubmit(event) {
    if (event.target.id !== 'answer-form') return;
    event.preventDefault();
    checkAnswer();
  }

  function isTyping(target) {
    if (!target) return false;
    var tag = String(target.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      if ($('.modal-overlay')) closeModal();
      return;
    }
    if ($('.modal-overlay')) return;
    if (isTyping(event.target)) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    var targetTag = String(event.target && event.target.tagName || '').toLowerCase();
    if ((targetTag === 'button' || targetTag === 'a') && (event.code === 'Space' || event.key === 'Enter')) return;

    var st = app.study;
    if (event.code === 'Space' || event.key === ' ') {
      if (st && st.item && !st.revealed) {
        event.preventDefault();
        revealCard();
      } else if (st && st.item) {
        event.preventDefault();
      }
      return;
    }
    if (event.key === 'Enter') {
      if (st && st.item && !st.revealed) {
        event.preventDefault();
        checkAnswer();
      }
      return;
    }
    if (event.key === 's' || event.key === 'S') {
      if (st && st.item) {
        event.preventDefault();
        playItemAudio('s', defaultAccent(), false, st.item.sentence);
      }
      return;
    }
    if (['1', '2', '3', '4'].indexOf(event.key) >= 0 && st && st.revealed) {
      event.preventDefault();
      rateCurrent(Number(event.key) - 1);
    }
  }

  function onDocumentClick(event) {
    if (event.defaultPrevented) return;
    onClick(event);
  }

  function init() {
    if (!DATA || !STORE || !VIEWS || !window.PE_SCENES) {
      $('#app').innerHTML = '<p style="padding:24px;font:16px system-ui">数据加载失败，请刷新页面。</p>';
      return;
    }
    if ('speechSynthesis' in window && window.speechSynthesis.getVoices) {
      window.speechSynthesis.getVoices();
    }
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('input', onInput);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('resize', updateSeasonScrollFade);

    if (!window.location.hash) {
      try {
        history.replaceState(null, '', '#/');
      } catch (err) {
        window.location.hash = '#/';
      }
    }
    lastHash = window.location.hash;
    renderRoute(parseHash(), true);

    window.PE_APP = {
      state: app,
      render: function () { renderRoute(parseHash(), true); },
      startStudy: function (id) { window.location.hash = id ? '#/study?item=' + id : '#/study'; },
      showAnswer: revealCard,
      check: checkAnswer,
      rate: rateCurrent,
      openSettings: settingsModal
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
