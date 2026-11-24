/* Peppa English — HTML views */
(function () {
  'use strict';

  var D = window.PE_DATA;
  var S = window.PE_STORE;
  var TOTAL = D.items.length;
  var ORIGINAL_URL = 'https://file.ankichinas.cn/h5/card/686d3ade63f048ut';

  var RESOURCES = [
    {
      title: 'Bilibili 正版英文版',
      desc: '英文音轨 + 中英字幕，国内首选。',
      meta: '视频平台',
      url: 'https://www.bilibili.com/bangumi/play/ep375425',
      icon: 'video'
    },
    {
      title: 'YouTube @PeppaPigOfficial',
      desc: '官方整集与合集，需合规网络访问。',
      meta: '官方频道',
      url: 'https://www.youtube.com/@PeppaPigOfficial',
      icon: 'globe'
    },
    {
      title: 'Paramount+',
      desc: '10 季打包，提供英文字幕。',
      meta: '流媒体',
      url: 'https://www.paramountplus.com/shows/peppa-pig/',
      icon: 'video'
    },
    {
      title: 'Netflix',
      desc: '部分地区上线 6 季，片库随区服变化。',
      meta: '流媒体',
      url: 'https://www.netflix.com/search?q=peppa%20pig',
      icon: 'video'
    },
    {
      title: 'Fandom episode list / transcripts',
      desc: '粉丝整理的片名与转录，仅个人参考，勿整段搬运。',
      meta: '粉丝资料',
      url: 'https://peppapig.fandom.com/wiki/Episodes',
      icon: 'book'
    },
    {
      title: 'Twinkl Peppa Pig 专区',
      desc: '官方授权课堂练习与打印材料（付费）。',
      meta: '付费资源',
      url: 'https://www.twinkl.com/search?q=peppa%20pig',
      icon: 'layers'
    },
    {
      title: 'Ladybird Read it Yourself',
      desc: '官方分级读物，适合亲子共读。',
      meta: '官方读物',
      url: 'https://www.ladybird.co.uk/search?q=peppa%20pig',
      icon: 'book'
    },
    {
      title: 'iSLCollective Peppa worksheets',
      desc: '教师分享的免费 ESL 练习纸。',
      meta: '免费练习',
      url: 'https://en.islcollective.com/english-esl-worksheets/search/peppa',
      icon: 'book'
    }
  ];

  function esc(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function icon(name, cls) {
    var paths = {
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
      book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"/>',
      chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
      back: '<path d="M15 18l-6-6 6-6"/>',
      gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.98 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3v-4h.08A1.7 1.7 0 0 0 4.6 8.98a1.7 1.7 0 0 0-.34-1.87l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.98 4.6 1.7 1.7 0 0 0 10 3.04V3h4v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.98 1.7 1.7 0 0 0 20.96 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/>',
      play: '<path d="M8 5.5v13l11-6.5Z" fill="currentColor" stroke="none"/>',
      speaker: '<path d="M4 9.5v5h3.5L12 19V5L7.5 9.5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18 6a8.5 8.5 0 0 1 0 12"/>',
      search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
      close: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
      arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
      check: '<path d="M4.5 12.5 9 17 19.5 6.5"/>',
      refresh: '<path d="M20 11a8 8 0 1 0-2.3 6.7"/><path d="M20 4v7h-7"/>',
      headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 13h3v6H5.5A1.5 1.5 0 0 1 4 17.5Z"/><path d="M20 13h-3v6h1.5a1.5 1.5 0 0 0 1.5-1.5Z"/>',
      layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
      video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/>',
      spark: '<path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m5.6 5.6 2.8 2.8"/><path d="m15.6 15.6 2.8 2.8"/><path d="m18.4 5.6-2.8 2.8"/><path d="m8.4 15.6-2.8 2.8"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
      chevron: '<path d="m9 6 6 6-6 6"/>',
      globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/>',
      external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
    };
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  function highlight(sentence, word) {
    var raw = String(sentence || '');
    var target = String(word || '');
    var at = raw.toLowerCase().indexOf(target.toLowerCase());
    if (at < 0) return esc(raw);
    return esc(raw.slice(0, at)) + '<span class="hl">' + esc(raw.slice(at, at + target.length)) + '</span>' + esc(raw.slice(at + target.length));
  }

  function blank(sentence, word, token) {
    var raw = String(sentence || '');
    var target = String(word || '');
    var at = raw.toLowerCase().indexOf(target.toLowerCase());
    if (at < 0) return esc(raw);
    return esc(raw.slice(0, at)) + '<span class="blank">' + (token || '____') + '</span>' + esc(raw.slice(at + target.length));
  }

  function statusOf(st) {
    if (!st || !st.seen) return 'new';
    if ((Number(st.box) || 0) >= 3) return 'mastered';
    return 'learning';
  }

  function statusLabel(status) {
    return { new: '新词', learning: '学习中', mastered: '已掌握' }[status] || '';
  }

  function nav(active) {
    var tabs = [
      { key: 'home', href: '#/', label: '学习', icon: 'home' },
      { key: 'browse', href: '#/browse', label: '词库', icon: 'book' },
      { key: 'stats', href: '#/stats', label: '统计', icon: 'chart' }
    ];
    return '<nav class="tabbar" aria-label="主导航"><div class="tabbar-inner">' + tabs.map(function (tab) {
      return '<a class="tab' + (active === tab.key ? ' active' : '') + '" href="' + tab.href + '">' + icon(tab.icon) + '<span>' + tab.label + '</span></a>';
    }).join('') + '</div></nav>';
  }

  /* ---------------------------------- HOME ---------------------------------- */

  function home(state) {
    state = state || {};
    var counts = S.getCounts();
    var stats = S.getStats();
    var settings = S.getSettings();
    var goal = Math.max(1, settings.dailyNew);
    var goalPct = Math.min(100, Math.round((stats.studiedToday / goal) * 100));
    var todayNew = Math.max(0, Math.min(counts.new, goal - stats.studiedToday));
    var sePct = TOTAL ? Math.round((counts.review / TOTAL) * 100) : 0;
    var lePct = TOTAL ? Math.round((counts.learning / TOTAL) * 100) : 0;

    var seasonCells = stats.seasons.map(function (row) {
      var pct = row.total ? Math.round((row.mastered / row.total) * 100) : 0;
      return '<button class="season-cell" data-season="' + row.season + '" aria-label="第 ' + row.season + ' 季，已掌握 ' + row.mastered + ' / ' + row.total + '">' +
        '<span class="season-no">' + String(row.season).padStart(2, '0') + '</span>' +
        '<span class="season-progress"><span class="season-count"><b>' + row.mastered + '</b>/' + row.total + '</span>' +
        '<span class="mini-bar"><i style="width:' + pct + '%"></i></span></span>' +
        '</button>';
    }).join('');

    var features = [
      { icon: 'headphones', title: '逐句循环精听', text: '英音 / 美音双语音，慢速 0.75× 细听每个词。' },
      { icon: 'video', title: '无字幕 · 英文字幕 · 双语字幕', text: '像看动画一样，随时切换字幕难度。' },
      { icon: 'layers', title: '单词闪卡', text: '场景插画 + 音标 + 例句 + 语法点，一卡学透。' },
      { icon: 'refresh', title: '间隔复习', text: '重来 / 困难 / 良好 / 简单，四档安排复习时间。' }
    ];

    return '<div class="page home-page">' +
      '<section class="hero">' +
        '<div class="hero-orb orb-a"></div><div class="hero-orb orb-b"></div>' +
        '<div class="hero-top"><span class="crumb">小学 <i>/</i> 英语</span><span class="hero-tag">Peppa English</span></div>' +
        '<h1>小猪佩奇<br><span>1-10 季单词闪卡</span></h1>' +
        '<p class="hero-sub">逐句精听 · 配套单词闪卡 · 10 季全</p>' +
        '<div class="hero-pills">' +
          '<span><b>4714</b> 张卡片</span><span><b>10</b> 季</span><span><b>1557.9</b> MB</span>' +
        '</div>' +
        '<div class="hero-pig" aria-hidden="true">' + pigFace() + '</div>' +
      '</section>' +

      '<div class="home-main">' +
        '<section class="today-card">' +
          '<div class="today-head"><div><p class="overline">今日学习</p><h2>' +
            (stats.studiedToday ? '继续保持，佩奇在等你！' : '跳进今天的第一片泥坑吧') +
          '</h2></div><span class="streak-chip">' + icon('spark') + '连续 ' + stats.streak + ' 天</span></div>' +
          '<div class="today-body">' +
            '<div class="ring" style="--p:' + goalPct + '" role="img" aria-label="今日目标完成 ' + goalPct + '%">' +
              '<div class="ring-inner"><b>' + stats.studiedToday + '</b><span>/ ' + goal + ' 张</span></div>' +
            '</div>' +
            '<div class="today-counts">' +
              '<div><b class="c-new">' + todayNew + '</b><span>今日新词</span></div>' +
              '<div><b class="c-learning">' + counts.learning + '</b><span>学习中</span></div>' +
              '<div><b class="c-review">' + counts.review + '</b><span>待复习</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="stackbar" aria-hidden="true"><i class="sb-review" style="width:' + sePct + '%"></i><i class="sb-learning" style="width:' + lePct + '%"></i></div>' +
          '<p class="stack-caption">已掌握 ' + stats.mastered + ' 张 · 总进度 ' + stats.percent + '%</p>' +
          '<a class="primary-btn" href="#/study">开始学习' + icon('arrow') + '</a>' +
          '<p class="today-foot">今日计划 ' + settings.dailyNew + ' 张新词 · 已答对 ' + stats.correctToday + ' 次</p>' +
        '</section>' +

        '<section class="panel season-panel">' +
          '<div class="panel-head"><div><p class="overline">季节目录</p><h2>十季完整句库</h2></div><span class="panel-note">已掌握 ' + stats.mastered + ' / ' + TOTAL + '</span></div>' +
          '<div class="season-grid">' + seasonCells + '</div>' +
        '</section>' +

        '<section class="panel feature-panel">' +
          '<div class="panel-head"><div><p class="overline">学习方式</p><h2>把动画变成听力课</h2></div></div>' +
          '<div class="feature-list">' + features.map(function (f) {
            return '<div class="feature"><span class="feature-icon">' + icon(f.icon) + '</span><div><h3>' + f.title + '</h3><p>' + f.text + '</p></div></div>';
          }).join('') + '</div>' +
        '</section>' +

        '<a class="resource-entry" href="#/resources">' +
          '<span class="resource-entry-icon">' + icon('globe') + '</span>' +
          '<span class="resource-entry-text"><span class="overline">学习资源</span><b>正版片源与练习推荐</b><em>Bilibili · YouTube · 官方读物 · 免费练习</em></span>' +
          '<span class="resource-entry-arrow">' + icon('arrow') + '</span>' +
        '</a>' +

        '<footer class="home-footer">' +
          '<p>本复现内置 ' + TOTAL + ' 个句卡（100 张精编 + 自动扩展），按 3 种练习模式计约 4,716 张。</p>' +
          '<p><a href="' + ORIGINAL_URL + '" target="_blank" rel="noopener">查看原资源页 ↗</a></p>' +
          '<p class="tiny">Peppa English · 小猪佩奇英语精听</p>' +
        '</footer>' +
      '</div>' + nav('home') + '</div>';
  }

  function pigFace() {
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<path d="M28 38 Q20 14 40 24 Z" fill="#F4A7BD"/><path d="M92 38 Q100 14 80 24 Z" fill="#F4A7BD"/>' +
      '<ellipse cx="60" cy="66" rx="44" ry="38" fill="#F4A7BD"/>' +
      '<path d="M16 64 Q18 30 60 26 Q102 30 104 64" fill="#F9C4D2" opacity="0.55"/>' +
      '<ellipse cx="44" cy="56" rx="5" ry="6.5" fill="#5B3A2E"/><ellipse cx="76" cy="56" rx="5" ry="6.5" fill="#5B3A2E"/>' +
      '<circle cx="46" cy="53" r="1.8" fill="#fff"/><circle cx="78" cy="53" r="1.8" fill="#fff"/>' +
      '<ellipse cx="60" cy="82" rx="19" ry="12" fill="#E77F9B"/>' +
      '<ellipse cx="53" cy="82" rx="3" ry="4" fill="#5B3A2E"/><ellipse cx="67" cy="82" rx="3" ry="4" fill="#5B3A2E"/>' +
      '<path d="M48 98 Q60 106 72 98" fill="none" stroke="#5B3A2E" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="25" cy="78" rx="8" ry="5" fill="#E77F9B" opacity="0.55"/><ellipse cx="95" cy="78" rx="8" ry="5" fill="#E77F9B" opacity="0.55"/>' +
      '</svg>';
  }

  /* --------------------------------- BROWSE --------------------------------- */

  function filterItems(q, season, status) {
    var query = String(q || '').trim().toLowerCase();
    return D.items.filter(function (item) {
      if (season !== 'all' && item.season !== Number(season)) return false;
      var st = S.getItemState(item.id);
      if (status !== 'all' && statusOf(st) !== status) return false;
      if (!query) return true;
      return (item.word + ' ' + item.sentence + ' ' + item.sentenceCn + ' ' + item.cn + ' ' + item.episodeTitle + ' ' + item.ipa).toLowerCase().indexOf(query) >= 0;
    });
  }

  function browseRows(q, season, status, limit) {
    var list = filterItems(q, season, status);
    limit = Math.max(20, Number(limit) || 60);
    var rows = list.slice(0, limit).map(function (item) {
      var st = S.getItemState(item.id);
      var status = statusOf(st);
      return '<button class="word-row" data-item="' + item.id + '">' +
        '<span class="status-dot ' + status + '" aria-label="' + statusLabel(status) + '"></span>' +
        '<span class="word-row-main">' +
          '<span class="word-row-top"><b class="word">' + esc(item.word) + '</b><span class="ipa">' + esc(item.ipa) + '</span><span class="pos">' + esc(item.pos) + '</span></span>' +
          '<span class="word-cn">' + esc(item.cn) + '</span>' +
          '<span class="word-sentence">' + highlight(item.sentence, item.word) + '</span>' +
        '</span>' +
        '<span class="word-row-side"><span class="ep-badge">S' + item.season + 'E' + item.episode + '</span>' + icon('chevron') + '</span>' +
      '</button>';
    }).join('');

    if (!list.length) {
      rows = '<div class="empty-state small"><div class="empty-icon">' + icon('search') + '</div><h3>没有找到匹配的句子</h3><p>换个关键词，或点“全部”重置筛选。</p></div>';
    }

    var more = list.length > limit
      ? '<button class="load-more" data-action="more-rows">加载更多 <span>还有 ' + (list.length - limit) + ' 条</span></button>'
      : '';
    return '<div class="browse-results" id="browse-results">' +
      '<p class="result-count">共 <b>' + list.length + '</b> 条</p>' + rows + more + '</div>';
  }

  function browse(state) {
    state = state || {};
    var q = state.q || '';
    var season = state.season === undefined ? 'all' : state.season;
    var status = state.status || 'all';
    var limit = state.limit || 60;
    var seasonChips = '<button class="chip' + (season === 'all' ? ' active' : '') + '" data-season-filter="all">全部</button>' +
      D.seasons.map(function (s) {
        return '<button class="chip' + (Number(season) === s.n ? ' active' : '') + '" data-season-filter="' + s.n + '">' + s.n + '</button>';
      }).join('');
    var statusChips = [{ k: 'all', t: '全部' }, { k: 'new', t: '新词' }, { k: 'learning', t: '学习中' }, { k: 'mastered', t: '已掌握' }].map(function (x) {
      return '<button class="chip' + (status === x.k ? ' active' : '') + '" data-status-filter="' + x.k + '">' + x.t + '</button>';
    }).join('');

    return '<div class="page browse-page">' +
      '<header class="simple-head">' +
        '<div><p class="overline">词库</p><h1>全量句库</h1></div>' +
        '<span class="head-count">' + TOTAL + ' 句</span>' +
      '</header>' +
      '<main class="browse-main">' +
        '<div class="search-wrap">' + icon('search') +
          '<input id="browse-search" type="search" autocomplete="off" placeholder="搜索单词、句子或中文" value="' + esc(q) + '" aria-label="搜索词库">' +
          '<button class="clear-btn' + (q ? ' show' : '') + '" data-action="clear-search" aria-label="清空搜索">' + icon('close') + '</button>' +
        '</div>' +
        '<div class="chip-scroll-wrap" id="season-scroll-wrap">' +
          '<div class="chip-scroll season-scroll" id="season-scroll" aria-label="按季筛选">' + seasonChips + '</div>' +
          '<span class="scroll-fade" aria-hidden="true">' + icon('chevron') + '</span>' +
        '</div>' +
        '<div class="chip-scroll status-scroll" aria-label="按状态筛选">' + statusChips + '</div>' +
        '<div id="browse-results-wrap">' + browseRows(q, season, status, limit) + '</div>' +
      '</main>' + nav('browse') + '</div>';
  }

  /* ---------------------------------- STATS --------------------------------- */

  function stats(state) {
    var st = S.getStats();
    var maxDay = 1;
    st.last7.forEach(function (d) { if (d.studied > maxDay) maxDay = d.studied; });
    var bars = st.seasons.map(function (row) {
      var pct = row.total ? Math.round((row.mastered / row.total) * 100) : 0;
      return '<div class="season-bar-row"><div class="season-bar-top"><span>第 ' + row.season + ' 季</span><span><b>' + row.mastered + '</b> / ' + row.total + '</span></div>' +
        '<div class="season-bar"><i style="width:' + pct + '%"></i></div></div>';
    }).join('');
    var days = st.last7.map(function (d) {
      var h = Math.round((d.studied / maxDay) * 100);
      return '<div class="day-col"><span class="day-count">' + (d.studied || '') + '</span><span class="day-track"><i style="height:' + Math.max(d.studied ? 8 : 2, d.studied ? h : 2) + '%"></i></span><span class="day-label">' + d.label + '<em>' + d.date.slice(5).replace('-', '/') + '</em></span></div>';
    }).join('');

    return '<div class="page stats-page">' +
      '<header class="simple-head">' +
        '<div><p class="overline">学习统计</p><h1>进步看得见</h1></div>' +
        '<span class="head-count">' + st.percent + '%</span>' +
      '</header>' +
      '<main class="stats-main">' +
        '<section class="stat-grid">' +
          '<div class="stat-card"><span class="stat-icon">' + icon('calendar') + '</span><b>' + st.studiedToday + '</b><span>今日已学</span></div>' +
          '<div class="stat-card"><span class="stat-icon">' + icon('spark') + '</span><b>' + st.streak + '</b><span>连续学习天数</span></div>' +
          '<div class="stat-card"><span class="stat-icon">' + icon('check') + '</span><b>' + st.mastered + '</b><span>已掌握</span></div>' +
          '<div class="stat-card"><span class="stat-icon">' + icon('chart') + '</span><b>' + st.percent + '%</b><span>总进度</span></div>' +
        '</section>' +

        '<section class="panel"><div class="panel-head"><div><p class="overline">分季进度</p><h2>十季掌握情况</h2></div><span class="panel-note">' + st.mastered + ' / ' + st.total + '</span></div>' +
          '<div class="season-bars">' + bars + '</div>' +
        '</section>' +

        '<section class="panel"><div class="panel-head"><div><p class="overline">最近 7 天</p><h2>每日学习量</h2></div><span class="panel-note">共 ' + st.last7.reduce(function (a, b) { return a + b.studied; }, 0) + ' 次</span></div>' +
          '<div class="day-chart" role="img" aria-label="最近七天学习次数">' + days + '</div>' +
          '<div class="chart-legend"><span>柱高代表当天完成的卡片数</span><span>最多 ' + maxDay + ' 次</span></div>' +
        '</section>' +

        '<div class="stats-actions">' +
          '<button class="secondary-btn" data-action="reset">' + icon('refresh') + '重置学习进度</button>' +
          '<a class="ghost-btn" href="#/">' + icon('back') + '返回首页</a>' +
        '</div>' +
        '<p class="stats-foot">进度保存在本机浏览器中（localStorage）。</p>' +
      '</main>' + nav('stats') + '</div>';
  }

  /* -------------------------------- RESOURCES ------------------------------- */

  function resources() {
    var cards = RESOURCES.map(function (r) {
      return '<a class="resource-row" href="' + r.url + '" target="_blank" rel="noopener">' +
        '<span class="resource-icon">' + icon(r.icon) + '</span>' +
        '<span class="resource-copy"><span class="resource-meta">' + esc(r.meta) + '</span>' +
          '<b>' + esc(r.title) + '</b><span>' + esc(r.desc) + '</span></span>' +
        '<span class="resource-open">' + icon('external') + '</span>' +
      '</a>';
    }).join('');

    return '<div class="page resources-page">' +
      '<header class="simple-head resources-head">' +
        '<a class="head-back" href="#/" aria-label="返回首页">' + icon('back') + '</a>' +
        '<div class="resources-heading"><p class="overline">学习资源</p><h1>看原片，做练习</h1></div>' +
        '<span class="head-count">' + RESOURCES.length + ' 项</span>' +
      '</header>' +
      '<main class="resources-main">' +
        '<section class="resource-intro">' +
          '<p class="overline">Official first</p>' +
          '<p>先看正版动画建立语境，再用分级读物与练习纸巩固。外部链接将在新标签页打开，内容与可用地区以平台为准。</p>' +
        '</section>' +

        '<section class="panel resources-panel">' +
          '<div class="panel-head"><div><p class="overline">片源与练习</p><h2>官方优先，社区补充</h2></div><span class="panel-note">' + RESOURCES.length + ' 个入口</span></div>' +
          '<div class="resource-list">' + cards + '</div>' +
        '</section>' +

        '<section class="season-note">' +
          '<div class="season-note-head"><span class="resource-icon">' + icon('layers') + '</span><div><p class="overline">Counting note</p><h2>季数口径</h2></div></div>' +
          '<p><b>TVmaze</b> 9 季 447 集；<b>Paramount+ / 国内平台</b>标 10–12 季；本应用按产品口径展示 1–10 季，<b>S10 为 2026 新批次</b>，仅部分片名公布。</p>' +
        '</section>' +

        '<section class="copyright-note">' +
          '<h2>版权说明</h2>' +
          '<p>本应用只用片名、词表与自写例句，不搬运动画转录或剧照。Peppa Pig 及相关角色版权归 Hasbro / 权利人所有；资源链接指向官方或授权平台，请支持正版。</p>' +
        '</section>' +

        '<a class="ghost-btn resources-back" href="#/">' + icon('back') + '返回首页</a>' +
      '</main>' +
    '</div>';
  }

  /* ---------------------------------- STUDY --------------------------------- */

  function diffChars(answer, word) {
    var a = String(answer || '');
    var b = String(word || '');
    var aLower = a.toLowerCase();
    var bLower = b.toLowerCase();
    var m = a.length;
    var n = b.length;
    var dp = [];
    var i;
    var j;
    for (i = 0; i <= m; i++) {
      dp.push(new Array(n + 1).fill(0));
    }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        dp[i][j] = aLower[i - 1] === bLower[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    var keep = {};
    i = m; j = n;
    while (i > 0 && j > 0) {
      if (aLower[i - 1] === bLower[j - 1]) {
        keep[i - 1] = true;
        i--; j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    var out = '';
    for (i = 0; i < a.length; i++) {
      out += '<span class="' + (keep[i] ? 'char-ok' : 'char-bad') + '">' + esc(a[i]) + '</span>';
    }
    return out || '<span class="char-empty">（未输入）</span>';
  }

  function studySubtitle(item, subtitle, cls) {
    if (subtitle === 'none') return '';
    var en = '<p class="sub-en ' + (cls || '') + '">' + esc(item.sentence) + '</p>';
    if (subtitle === 'en') return '<div class="subtitle-box">' + en + '</div>';
    return '<div class="subtitle-box">' + en + '<p class="sub-zh">' + esc(item.sentenceCn) + '</p></div>';
  }

  function studyBar(state) {
    var counts = state.counts;
    var pct = state.total ? Math.round((state.idx / state.total) * 100) : 0;
    return '<header class="study-bar">' +
      '<div class="study-bar-top">' +
        '<button class="bar-icon" data-action="back" aria-label="' + (state.single ? '返回词库' : '返回首页') + '">' + icon('back') + '</button>' +
        '<div class="study-title"><p>小猪佩奇英语精听</p><span>' + (state.single ? '单卡练习' : (state.item ? '第 ' + state.item.season + ' 季 · ' + esc(state.item.episodeTitle) : (state.total ? '本组完成 · 今日继续加油' : '今日任务已完成'))) + '</span></div>' +
        '<div class="study-tools">' +
          '<span class="counts-pill" aria-label="新词、学习中、待复习"><b class="c-new">' + counts.new + '</b><i>+</i><b class="c-learning">' + counts.learning + '</b><i>+</i><b class="c-review">' + counts.review + '</b></span>' +
          '<button class="bar-icon" data-action="settings" aria-label="学习设置">' + icon('gear') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="session-progress" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
    '</header>';
  }

  function study(state) {
    state = state || {};
    var counts = state.counts || S.getCounts();
    var subtitle = state.subtitle || 'none';

    if (!state.item) {
      return '<div class="page study-page">' + studyBar(state) +
        '<main class="study-canvas"><section class="empty-card">' +
          '<div class="empty-check">' + icon('check') + '</div>' +
          '<p class="overline">Session complete</p>' +
          '<h2>今日任务已完成</h2>' +
          '<p>新词 ' + counts.new + ' · 学习中 ' + counts.learning + ' · 待复习 ' + counts.review + '</p>' +
          '<div class="empty-actions"><button class="primary-btn" data-action="again">再来一轮' + icon('refresh') + '</button><a class="ghost-btn" href="#/browse">去词库</a></div>' +
        '</section></main></div>';
    }

    var item = state.item;
    var mode = state.mode || 'listen';
    var slow = !!state.slow;
    var modeTabs = [{ k: 'listen', t: '听音拼词' }, { k: 'word', t: '英文单词' }, { k: 'meaning', t: '中文释义' }].map(function (x) {
      return '<button class="mode-tab' + (mode === x.k ? ' active' : '') + '" data-mode="' + x.k + '">' + x.t + '</button>';
    }).join('');
    var subtitleChips = [{ k: 'none', t: '无字幕' }, { k: 'en', t: '英文字幕' }, { k: 'both', t: '双语字幕' }].map(function (x) {
      return '<button class="sub-chip' + (subtitle === x.k ? ' active' : '') + '" data-subtitle="' + x.k + '">' + x.t + '</button>';
    }).join('');

    var prompt = '';
    if (mode === 'listen') {
      prompt = '<div class="prompt-block listen-prompt"><span class="prompt-label">' + icon('headphones') + '听音拼词</span>' +
        '<p class="cn-hint">' + esc(item.sentenceCn) + '</p>' +
        '<p class="pattern">' + blank(item.sentence, item.word, '____') + '</p></div>';
    } else if (mode === 'word') {
      prompt = '<div class="prompt-block"><span class="prompt-label">英文单词</span>' +
        '<p class="pattern">' + blank(item.sentence, item.word, '____') + '</p></div>';
    } else {
      prompt = '<div class="prompt-block meaning-prompt"><span class="prompt-label">中文释义</span>' +
        '<p class="meaning-cn">' + esc(item.cn) + '</p><p class="meaning-hint">写出对应的英文单词</p></div>';
    }

    var feedback = '';
    if (state.checked) {
      feedback = '<div class="feedback ' + (state.correct ? 'ok' : 'bad') + '">' +
        '<div class="fb-head"><span class="fb-mark">' + (state.correct ? icon('check') : icon('close')) + '</span>' +
        '<div><b>' + (state.correct ? '正确' : '错误') + '</b><span>' + (state.correct ? '听得很准，记得跟读一遍。' : '红色字母需要修正，再看看正确答案。') + '</span></div></div>' +
        '<div class="fb-row"><span>你的答案</span><p class="answer-diff">' + diffChars(state.answer, item.word) + '</p></div>' +
        '<div class="fb-row"><span>正确答案</span><p class="answer-good">' + esc(item.word) + '</p></div>' +
      '</div>';
    }

    var back = '';
    if (state.revealed) {
      back = '<section class="card-back">' +
        '<div class="scene-wrap' + (state.playing ? ' playing' : '') + '">' +
          '<div class="scene-frame">' + window.PE_SCENES.render(item.scene) + '</div>' +
          '<button class="video-btn" data-action="video">' + icon('play') + '视频播放</button>' +
        '</div>' +
        '<div class="word-head">' +
          '<div class="word-title"><h2>' + esc(item.word) + '</h2><span class="pos-chip">' + esc(item.pos) + '</span></div>' +
          '<div class="word-meta"><span class="ipa">' + esc(item.ipa) + '</span><button class="speak-mini" data-speak="UK" aria-label="朗读单词">' + icon('speaker') + '</button></div>' +
        '</div>' +
        '<p class="back-sentence">' + highlight(item.sentence, item.word) + '</p>' +
        '<p class="back-cn">' + esc(item.sentenceCn) + '</p>' +
        '<div class="grammar-box"><span>' + icon('spark') + '语法分析</span><p>' + esc(item.grammar) + '</p></div>' +
        '<div class="rate-wrap"><p class="rate-title">这张卡记得怎么样？</p>' +
          '<div class="rate-grid">' +
            '<button class="rate-btn again" data-rate="0"><b>重来</b><span>&lt;1 分</span></button>' +
            '<button class="rate-btn hard" data-rate="1"><b>困难</b><span>&lt;6 分</span></button>' +
            '<button class="rate-btn good" data-rate="2"><b>良好</b><span>&lt;10 分</span></button>' +
            '<button class="rate-btn easy" data-rate="3"><b>简单</b><span>4 天</span></button>' +
          '</div>' +
          '<p class="rate-hint">按 <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> 快速评分</p>' +
        '</div>' +
      '</section>';
    }

    var dots = '';
    for (var i = 0; i < 20; i++) {
      var cls = i < state.idx ? 'done' : (i === state.idx ? 'current' : '');
      dots += '<span class="' + cls + '"></span>';
    }

    return '<div class="page study-page">' + studyBar(state) +
      '<main class="study-canvas">' +
        '<div class="card-meta"><span>卡片 ' + Math.min(state.idx + 1, state.total) + ' / ' + state.total + '</span>' +
          (state.single ? '<a class="meta-link" href="#/browse?season=' + item.season + '">返回词库</a>' : '<span class="meta-hint">S' + item.season + 'E' + item.episode + '</span>') +
        '</div>' +
        '<section class="study-card">' +
          '<div class="audio-row">' +
            '<div class="audio-pill uk"><span>英音</span><button data-speak="UK" aria-label="播放英音">' + icon('play') + '</button></div>' +
            '<div class="audio-pill us"><span>美音</span><button data-speak="US" aria-label="播放美音">' + icon('play') + '</button></div>' +
            '<button class="slow-toggle' + (slow ? ' on' : '') + '" data-action="slow" aria-pressed="' + slow + '">慢速 0.75×</button>' +
          '</div>' +
          '<div class="mode-tabs" role="tablist" aria-label="学习模式">' + modeTabs + '</div>' +
          '<div class="subtitle-chips" role="group" aria-label="字幕模式">' + subtitleChips + '</div>' +
          studySubtitle(item, subtitle) +
          prompt +
          (state.revealed ? '' :
            '<form class="answer-form" id="answer-form" autocomplete="off">' +
              '<input id="answer-input" name="answer" type="text" placeholder="在这里输入听写内容" value="' + esc(state.answer || '') + '" aria-label="输入答案" autocapitalize="off" spellcheck="false">' +
              '<button class="check-btn" type="submit">检查答案</button>' +
              '<button class="reveal-btn" type="button" data-action="reveal">显示答案</button>' +
              '<p class="shortcut-hint">Enter 检查 · 空格 显示答案 · S 朗读</p>' +
            '</form>') +
          feedback +
          back +
        '</section>' +
        '<div class="dots" aria-label="本组进度">' + dots + '</div>' +
        '<p class="study-tip">' + (state.revealed ? '选择下方按钮安排下次复习时间' : '先听两遍，再动笔；实在想不起来就按空格。') + '</p>' +
      '</main>' +
    '</div>';
  }

  window.PE_VIEWS = {
    home: home,
    browse: browse,
    stats: stats,
    resources: resources,
    study: study,
    browseRows: browseRows,
    filterItems: filterItems,
    nav: nav,
    icon: icon,
    esc: esc,
    statusOf: statusOf
  };
})();
