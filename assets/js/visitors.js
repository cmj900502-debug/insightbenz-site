/* 오늘 방문 badge — every page view today (Asia/Seoul day), refreshes and repeat visits included.
   Providers (free, no signup/token, CORS), configured HERE — the HTML data-vc attribute is legacy and ignored:
     1. CountAPI   https://countapi.mileshilliard.com     /api/v1/hit|get/<ns>-hits-YYYYMMDD → {"key":…,"value":N}
     2. Abacus     https://abacus.jasoncameron.dev        /hit|get/<ns>/hits-YYYYMMDD        → {"value":N}
        (Abacus was primary until 2026-10-28, when it started timing out intermittently.)
   data-vc-ns = namespace · key carries the KST date → new key (= reset) at 00:00 KST.
   • normal browsers: one "hit" per page load on EVERY provider in parallel (so the fallback's count stays current),
     then the badge shows the first provider in priority order that answers within 4 s → instant, no delayed stats.
   • automated browsers (navigator.webdriver), bot user agents, localhost / 127.* / file: → "get" (read only, never counts)
   • every provider failing / timing out / odd value / key not created yet (404 on read) → badge stays hidden, no error thrown. */
(function(){
  'use strict';
  var els = document.querySelectorAll('.vc[data-vc]');
  if (!els.length || !window.fetch || !window.Promise) return;
  var ns = els[0].getAttribute('data-vc-ns');
  if (els[0].getAttribute('data-vc-range') !== 'today' || !/^[A-Za-z0-9_.-]{3,64}$/.test(ns || '')) return;
  var day;
  try {
    var p = {};
    new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'})
      .formatToParts(new Date()).forEach(function(x){ p[x.type] = x.value; });
    day = p.year + p.month + p.day;
  } catch (e) { day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10).replace(/-/g, ''); }
  if (!/^\d{8}$/.test(day)) return;
  var T = window.__VC_TEST__ || {};   // QA hook only (qa/interact.py sets it via an init script; the counter services are stubbed there)
  var PROVIDERS = T.providers || [
    function(op){ return 'https://countapi.mileshilliard.com/api/v1/' + op + '/' + ns + '-hits-' + day; },
    function(op){ return 'https://abacus.jasoncameron.dev/' + op + '/' + ns + '/hits-' + day; }
  ];
  var TIMEOUT = T.timeout || 4000;
  var BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|kakaotalk-scrap|yeti|daum|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix/i;
  var local = !T.allowLocal && (location.protocol === 'file:' || /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\]|)$/.test(location.hostname));
  var readOnly = local || (!T.allowBot && (navigator.webdriver === true || BOT.test(navigator.userAgent || '')));
  var op = readOnly ? 'get' : 'hit';

  function ask(mk){
    return new Promise(function(done){
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function(){ if (ctl) ctl.abort(); done(null); }, TIMEOUT);
      fetch(mk(op), {cache: 'no-store', credentials: 'omit', signal: ctl ? ctl.signal : undefined})
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(d){
          var n = d && d.value;
          clearTimeout(timer);
          done(typeof n === 'number' && isFinite(n) && n >= 0 && n % 1 === 0 && n <= 1e9 ? n : null);
        })
        .catch(function(){ clearTimeout(timer); done(null); });
    });
  }
  function show(n){
    var t = n.toLocaleString('ko-KR');
    for (var i = 0; i < els.length; i++) {
      var b = els[i].querySelector('.vc-n');
      if (b) { b.textContent = t; els[i].hidden = false; }
    }
  }
  var jobs = PROVIDERS.map(ask);          // all requests start now, in parallel
  (function next(i){                      // show the highest-priority provider that answered
    if (i >= jobs.length) return;         // all failed → stay hidden
    jobs[i].then(function(n){ if (n === null) next(i + 1); else show(n); });
  })(0);
})();
