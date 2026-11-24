/* Peppa English — local state, SRS scheduling and stats */
(function () {
  'use strict';

  var KEY = 'peppa-english-v1';
  var DAY = 24 * 60 * 60 * 1000;
  var MIN = 60 * 1000;
  var memory = null;

  function defaults() {
    return {
      items: {},
      settings: { voice: 'UK', dailyNew: 20, subtitle: 'none', slow: false },
      daily: {}
    };
  }

  function todayKey(d) {
    d = d || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function load() {
    if (memory) return memory;
    var state = defaults();
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          state.items = parsed.items && typeof parsed.items === 'object' ? parsed.items : {};
          state.daily = parsed.daily && typeof parsed.daily === 'object' ? parsed.daily : {};
          if (parsed.settings && typeof parsed.settings === 'object') {
            state.settings.voice = parsed.settings.voice === 'US' ? 'US' : 'UK';
            state.settings.dailyNew = Number(parsed.settings.dailyNew) || 20;
            state.settings.subtitle = ['none', 'en', 'both'].indexOf(parsed.settings.subtitle) >= 0 ? parsed.settings.subtitle : 'none';
            state.settings.slow = !!parsed.settings.slow;
          }
        }
      }
    } catch (err) {
      /* file:// or disabled storage — keep working in memory */
      state = defaults();
    }
    memory = state;
    return state;
  }

  function save() {
    var state = load();
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* in-memory fallback */
      memory = state;
    }
  }

  function blankState() {
    return { box: 0, due: 0, seen: false, correct: 0, wrong: 0, last: 0 };
  }

  function getItemState(id) {
    var rec = load().items[id];
    if (!rec) return blankState();
    return {
      box: Math.max(0, Math.min(3, Number(rec.box) || 0)),
      due: Number(rec.due) || 0,
      seen: !!rec.seen,
      correct: Number(rec.correct) || 0,
      wrong: Number(rec.wrong) || 0,
      last: Number(rec.last) || 0
    };
  }

  function ensureDay(state, key) {
    if (!state.daily[key]) state.daily[key] = { studied: 0, correct: 0, newCount: 0 };
    if (typeof state.daily[key].newCount !== 'number') state.daily[key].newCount = 0;
    return state.daily[key];
  }

  function getCounts() {
    var state = load();
    var counts = { new: 0, learning: 0, review: 0 };
    PE_DATA.items.forEach(function (item) {
      var st = state.items[item.id];
      if (!st || !st.seen) counts.new++;
      else if ((Number(st.box) || 0) >= 3) counts.review++;
      else counts.learning++;
    });
    return counts;
  }

  function buildQueue(limit) {
    limit = Math.max(1, Number(limit) || 20);
    var state = load();
    var now = Date.now();
    var due = [];
    var unseen = [];

    PE_DATA.items.forEach(function (item, index) {
      var st = state.items[item.id];
      if (!st || !st.seen) {
        unseen.push({ item: item, index: index });
      } else if ((Number(st.due) || 0) <= now) {
        due.push({ item: item, due: Number(st.due) || 0, index: index });
      }
    });

    due.sort(function (a, b) { return a.due - b.due || a.index - b.index; });

    var day = state.daily[todayKey()] || { newCount: 0 };
    var remainingNew = Math.max(0, (Number(state.settings.dailyNew) || 20) - (Number(day.newCount) || 0));
    var queue = due.slice(0, limit).map(function (x) { return x.item; });

    if (queue.length < limit && remainingNew > 0) {
      unseen.slice(0, remainingNew).forEach(function (x) {
        if (queue.length < limit) queue.push(x.item);
      });
    }

    /* Nothing scheduled or allowed: still give the learner something to study. */
    if (!queue.length) {
      queue = unseen.slice(0, limit).map(function (x) { return x.item; });
    }
    return queue;
  }

  function rate(itemId, level) {
    var state = load();
    var found = null;
    for (var i = 0; i < PE_DATA.items.length; i++) {
      if (PE_DATA.items[i].id === itemId) { found = PE_DATA.items[i]; break; }
    }
    if (!found) return null;

    var now = Date.now();
    var old = getItemState(itemId);
    var next = { box: 0, due: now + MIN, seen: true, correct: old.correct, wrong: old.wrong, last: now };

    if (level === 0 || level === 'again') {
      next.box = 0; next.due = now + 1 * MIN; next.wrong++;
    } else if (level === 1 || level === 'hard') {
      next.box = 1; next.due = now + 6 * MIN; next.wrong++;
    } else if (level === 2 || level === 'good') {
      next.box = 2; next.due = now + 10 * MIN; next.correct++;
    } else {
      next.box = 3; next.due = now + 4 * DAY; next.correct++;
    }

    state.items[itemId] = next;
    var day = ensureDay(state, todayKey());
    day.studied++;
    if (level === 2 || level === 'good' || level === 3 || level === 'easy') day.correct++;
    if (!old.seen) day.newCount++;
    save();
    return next;
  }

  function getSettings() {
    var s = load().settings;
    return {
      voice: s.voice === 'US' ? 'US' : 'UK',
      dailyNew: Number(s.dailyNew) || 20,
      subtitle: s.subtitle || 'none',
      slow: !!s.slow
    };
  }

  function updateSettings(patch) {
    var state = load();
    Object.keys(patch || {}).forEach(function (k) {
      if (k === 'voice') state.settings.voice = patch[k] === 'US' ? 'US' : 'UK';
      else if (k === 'dailyNew') state.settings.dailyNew = Math.max(5, Math.min(100, Number(patch[k]) || 20));
      else if (k === 'subtitle' && ['none', 'en', 'both'].indexOf(patch[k]) >= 0) state.settings.subtitle = patch[k];
      else if (k === 'slow') state.settings.slow = !!patch[k];
    });
    save();
    return getSettings();
  }

  function getDaily() {
    return load().daily;
  }

  function resetAll() {
    var state = load();
    state.items = {};
    state.daily = {};
    save();
    return true;
  }

  function getStats() {
    var state = load();
    var counts = getCounts();
    var seasons = [];
    var totalMastered = 0;

    for (var n = 1; n <= 10; n++) {
      var total = 0;
      var mastered = 0;
      var learning = 0;
      PE_DATA.items.forEach(function (item) {
        if (item.season !== n) return;
        total++;
        var st = state.items[item.id];
        if (st && st.seen && (Number(st.box) || 0) >= 3) mastered++;
        else if (st && st.seen) learning++;
      });
      totalMastered += mastered;
      seasons.push({ season: n, total: total, mastered: mastered, learning: learning, fresh: total - mastered - learning });
    }

    var totalItems = PE_DATA.items.length;
    var today = state.daily[todayKey()] || { studied: 0, correct: 0 };
    var streak = 0;
    var cursor = new Date();
    if (!(state.daily[todayKey()] && state.daily[todayKey()].studied > 0)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    for (var guard = 0; guard < 3650; guard++) {
      var k = todayKey(cursor);
      if (state.daily[k] && state.daily[k].studied > 0) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    var last7 = [];
    for (var d = 6; d >= 0; d--) {
      var day = new Date();
      day.setHours(12, 0, 0, 0);
      day.setDate(day.getDate() - d);
      var key = todayKey(day);
      var log = state.daily[key] || { studied: 0, correct: 0 };
      last7.push({ date: key, label: weekdays[day.getDay()], studied: log.studied || 0, correct: log.correct || 0 });
    }

    return {
      total: totalItems,
      mastered: totalMastered,
      learning: counts.learning,
      fresh: counts.new,
      review: counts.review,
      studiedToday: today.studied || 0,
      correctToday: today.correct || 0,
      streak: streak,
      percent: totalItems ? Math.round((totalMastered / totalItems) * 100) : 0,
      seasons: seasons,
      last7: last7
    };
  }

  window.PE_STORE = {
    KEY: KEY,
    todayKey: todayKey,
    getCounts: getCounts,
    buildQueue: buildQueue,
    rate: rate,
    getItemState: getItemState,
    getSettings: getSettings,
    updateSettings: updateSettings,
    getDaily: getDaily,
    getStats: getStats,
    resetAll: resetAll
  };
})();
