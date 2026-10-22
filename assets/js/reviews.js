/* 구매후기 form (Netlify Forms "review"): star label, photo size check, double-submit guard. No data leaves the page until the visitor submits. */
(function(){
  'use strict';
  var form = document.getElementById('review-form');
  if (!form) return;
  var words = ['', '아쉬워요', '그저 그래요', '괜찮아요', '만족해요', '최고예요'];
  var out = document.getElementById('rate-out');
  var sync = function(){
    var c = form.querySelector('input[name="rating"]:checked');
    form.setAttribute('data-rate', c ? c.value : '0');
    if (out) out.textContent = c ? c.value + '점 · ' + words[+c.value] : '별점을 골라 주세요';
  };
  form.querySelectorAll('input[name="rating"]').forEach(function(r){ r.addEventListener('change', sync); });
  sync();
  var photo = document.getElementById('rv-photo'), MAX = 8 * 1024 * 1024;
  if (photo) photo.addEventListener('change', function(){
    var f = photo.files && photo.files[0];
    photo.setCustomValidity(f && f.size > MAX ? '사진은 8MB 이하로 올려 주세요.' : '');
    if (f && f.size > MAX) photo.reportValidity();
  });
  form.addEventListener('submit', function(e){
    if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
    var b = form.querySelector('button[type="submit"]');
    if (b) { b.disabled = true; b.textContent = '보내는 중…'; }
  });
})();
