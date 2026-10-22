/* 구매후기 접수 (reviews.html #write) — 카카오톡 오픈채팅/문자로 보내는 정적 안내. Nothing is posted from this page.
   • "후기 양식 복사": copies the template (#rv-template) to the clipboard (Clipboard API, falls back to a hidden textarea + execCommand).
   • "카카오톡으로 후기 보내기": open chat can't take prefilled text, so the template is copied on the same tap before KakaoTalk opens.
   • "문자로 보내기": prefilled sms: body; iOS uses "&body=", others "?body=". */
(function(){
  'use strict';
  var tpl = document.getElementById('rv-template');
  if (!tpl) return;
  var text = tpl.textContent, out = document.getElementById('rv-copied'), btn = document.getElementById('rv-copy');
  var say = function(m){ if (out) { out.textContent = m; } };
  var fallback = function(){
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta); return ok;
  };
  var copy = function(then){
    var done = function(ok){
      say(ok ? '복사했어요! 카카오톡 채팅창에 붙여넣어 주세요.' : '복사가 안 되면 위 양식을 길게 눌러 직접 복사해 주세요.');
      if (ok && btn) { btn.textContent = '복사 완료 ✓'; setTimeout(function(){ btn.textContent = '후기 양식 복사'; }, 2500); }
      if (then) then(ok);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function(){ done(true); }, function(){ done(fallback()); });
    else done(fallback());
  };
  if (btn) btn.addEventListener('click', function(){ copy(); });
  var kk = document.getElementById('rv-kakao');
  if (kk) kk.addEventListener('click', function(){ copy(); });   // default navigation (new tab) still happens
  var sms = document.getElementById('rv-sms');
  if (sms && /iPhone|iPad|iPod/.test(navigator.userAgent || '')) sms.href = sms.href.replace('?body=', '&body=');
})();
