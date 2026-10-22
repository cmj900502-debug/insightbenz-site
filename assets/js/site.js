(function(){
  'use strict';
  var C = window.SITE_CONFIG || {};
  var root = document.documentElement.getAttribute('data-root') || '';
  // 1) fill placeholders
  document.querySelectorAll('[data-ph]').forEach(function(el){
    var v = C[el.getAttribute('data-ph')];
    if (v) { el.textContent = v; el.classList.remove('ph'); }
  });
  document.querySelectorAll('[data-href]').forEach(function(el){
    var key = el.getAttribute('data-href'), v = C[key];
    if (!v) return;
    if (key === 'phone') v = 'tel:' + v.replace(/[^0-9+]/g,'');
    else if (key === 'email') v = 'mailto:' + v;
    el.setAttribute('href', v);
    if (/^https?:/.test(v)) { el.setAttribute('target','_blank'); el.setAttribute('rel','noopener'); }
  });
  // optional links: hide when the config value is empty (build already omits them; this covers edited config.js)
  document.querySelectorAll('[data-optional]').forEach(function(el){
    if (!C[el.getAttribute('data-optional')]) el.hidden = true;
  });
  // profile photo: replace the initials avatar when config.photo is set
  if (C.photo) document.querySelectorAll('[data-photo-slot]').forEach(function(slot){
    var img = document.createElement('img');
    img.src = /^https?:|^\//.test(C.photo) ? C.photo : root + C.photo;
    img.alt = (C.name || '') + ' ' + (C.title || '') + ' 프로필 사진';
    img.width = 400; img.height = 500; img.className = 'profile-img';
    slot.innerHTML = ''; slot.appendChild(img); slot.classList.add('has-photo');
  });
  if (C.siteName) document.title = document.title.replace(/\[사이트 이름\]/g, C.siteName);

  // 2) top menu strip (mobile): keep the current item in view
  var menu = document.querySelector('.sh .menu');
  if (menu && menu.scrollWidth > menu.clientWidth) {
    var curA = menu.querySelector('a[aria-current]');
    if (curA && curA.offsetLeft + curA.offsetWidth > menu.clientWidth - 24) menu.scrollLeft = Math.max(0, curA.offsetLeft - 48);
  }
  // 2b) legacy mobile menu
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('mnav');
  if (btn && nav) btn.addEventListener('click', function(){
    var open = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // 3) generic text filter: <input data-filter="#list"> filters children having data-search
  document.querySelectorAll('input[data-filter]').forEach(function(inp){
    var list = document.querySelector(inp.getAttribute('data-filter'));
    var counter = document.querySelector(inp.getAttribute('data-count') || '#none');
    var norm = function(s){ return (s||'').toLowerCase().replace(/[\s·\-()㈜]/g,''); };
    var run = function(){
      var q = norm(inp.value), n = 0, cat = list.getAttribute('data-cat') || '전체';
      list.querySelectorAll('[data-search]').forEach(function(it){
        var okQ = !q || norm(it.getAttribute('data-search')).indexOf(q) > -1;
        var cats = it.getAttribute('data-cats');
        var okC = cat === '전체' || !cats || cats.split('|').indexOf(cat) > -1;
        var show = okQ && okC; it.classList.toggle('hide', !show); if (show) n++;
      });
      list.querySelectorAll('[data-group]').forEach(function(g){
        g.classList.toggle('hide', !g.querySelector('[data-search]:not(.hide)'));
      });
      if (counter) counter.textContent = n;
      var empty = document.querySelector(inp.getAttribute('data-empty') || '#none');
      if (empty) empty.classList.toggle('hide', n > 0);
    };
    inp.addEventListener('input', run);
    document.querySelectorAll('[data-cat-for="' + inp.getAttribute('data-filter') + '"] [data-cat]').forEach(function(b){
      b.addEventListener('click', function(){
        list.setAttribute('data-cat', b.getAttribute('data-cat'));
        b.parentNode.querySelectorAll('[data-cat]').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        run();
      });
    });
    run();
  });

  // 4) trim selector (guide pages)
  var trims = document.querySelectorAll('.trim[data-trim]');
  if (trims.length) {
    var select = function(id){
      trims.forEach(function(t){ t.setAttribute('aria-pressed', t.getAttribute('data-trim') === id ? 'true' : 'false'); });
      document.querySelectorAll('.trim-panel').forEach(function(p){ p.hidden = p.id !== 'panel-' + id; });
    };
    trims.forEach(function(t){ t.addEventListener('click', function(){
      select(t.getAttribute('data-trim'));
      var d = document.getElementById('detail'); if (d) d.scrollIntoView({behavior:'smooth', block:'start'});
    }); });
    document.querySelectorAll('[data-year]').forEach(function(b){
      b.addEventListener('click', function(){
        var y = b.getAttribute('data-year');
        document.querySelectorAll('[data-year]').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        trims.forEach(function(t){ t.classList.toggle('hide', y !== '전체' && t.getAttribute('data-y') !== y); });
      });
    });
    select(trims[0].getAttribute('data-trim'));
    // deep link #t-<year>-<trim> (전국 재고 모델명 → this trim's 옵션·제원 panel): open that panel, then scroll to it
    var openHash = function(){
      var h = decodeURIComponent((location.hash || '').slice(1));
      if (!/^t-/.test(h)) return;
      var a = document.getElementById(h), p = a && a.closest('.trim-panel');
      if (!p) return;
      var id = p.id.replace('panel-', '');
      var allY = document.querySelector('[data-year="전체"]'); if (allY) allY.click();
      select(id);
      // colour deep link (#t-…-c<code>, from 전국 재고 색상 조합 rows): highlight that 외장 컬러 and bring it into view
      document.querySelectorAll('.opt.opt-hit').forEach(function(o){ o.classList.remove('opt-hit'); o.removeAttribute('aria-current'); });
      var hit = a.classList.contains('opt') ? a : null;
      if (hit) { hit.classList.add('opt-hit'); hit.setAttribute('aria-current', 'true'); }
      var go = function(){
        var d = document.getElementById('detail'); if (d) d.scrollIntoView({block: 'start', behavior: 'instant'});
        // keep the trim title in view when the colour also fits; otherwise centre the colour
        if (hit) { var r = hit.getBoundingClientRect(); if (r.bottom > innerHeight - 24 || r.top < 0) hit.scrollIntoView({block: 'center', behavior: 'instant'}); }
      };
      go(); setTimeout(go, 120);
      if (document.readyState !== 'complete') window.addEventListener('load', function(){ setTimeout(go, 0); }, {once: true});
    };
    openHash(); window.addEventListener('hashchange', openHash);
  }

  // 5) contact form (static: no backend)
  var form = document.getElementById('consult-form');
  if (form) {
    if (C.formUrl) { var ext = document.getElementById('ext-form'); if (ext) ext.classList.remove('hide'); }
    var pre = new URLSearchParams(location.search).get('model');
    if (pre && form.model) {
      var found = Array.prototype.some.call(form.model.options, function(o){ return o.value === pre; });
      if (found) form.model.value = pre;
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form), lines = [];
      data.forEach(function(v,k){ if (k !== 'agree') lines.push(k + ': ' + v); });
      var msg = document.getElementById('form-msg');
      if (C.email) {
        location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('[상담 신청] ' + (data.get('model')||'')) + '&body=' + encodeURIComponent(lines.join('\n'));
        msg.textContent = '메일 앱이 열립니다. 전송을 완료해 주세요.';
        msg.classList.add('show');
      } else {
        // no backend/email configured: hand the summary to SMS or KakaoTalk
        var text = '[상담 신청]\n' + lines.join('\n');
        msg.innerHTML = '';
        var p = document.createElement('p'); p.textContent = '작성하신 내용을 정리했습니다. 아래 버튼으로 바로 보내 주세요.'; msg.appendChild(p);
        var pre = document.createElement('pre'); pre.className = 'form-summary'; pre.textContent = text; msg.appendChild(pre);
        var box = document.createElement('div'); box.className = 'btns';
        if (C.phone) {
          var sms = document.createElement('a'); sms.className = 'btn btn-dark';
          sms.href = 'sms:' + C.phone.replace(/[^0-9+]/g,'') + '?body=' + encodeURIComponent(text); sms.textContent = '문자로 보내기';
          box.appendChild(sms);
        }
        if (C.kakaoUrl) {
          var kk = document.createElement('a'); kk.className = 'btn btn-line'; kk.href = C.kakaoUrl; kk.target = '_blank'; kk.rel = 'noopener';
          kk.textContent = '내용 복사 후 카카오톡 열기';
          kk.addEventListener('click', function(){ if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function(){}); });
          box.appendChild(kk);
        }
        msg.appendChild(box);
        msg.classList.add('show');
      }
    });
  }
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
/* 이달의 신차 영상: 화면에 보일 때만 재생 (모션 줄이기 설정이면 컨트롤만 표시) */
(function(){
  var vs = document.querySelectorAll('video[data-autoplay]'); if (!vs.length) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  vs.forEach(function(v){ v.muted = true;
    v.addEventListener('click', function(){ if (v.paused) { v.play().catch(function(){}); } else { v.pause(); } });
    if (reduce || !('IntersectionObserver' in window)) { v.controls = true; v.preload = 'metadata'; } });
  if (reduce || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ var v = e.target;
    if (e.isIntersecting) { v.play().catch(function(){ v.controls = true; }); } else { v.pause(); } }); }, {threshold: 0.35});
  vs.forEach(function(v){ io.observe(v); });
})();
