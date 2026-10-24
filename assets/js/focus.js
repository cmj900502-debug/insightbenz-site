/* 포커스 모델 (focus.html) — benefit selector: highlights applicable benefit sections. No price calculation. */
(function () {
  var box = document.getElementById('benefit-selector'); if (!box) return;
  var out = document.getElementById('benefit-out');
  var MSG = {
    car: { benz: '지금 벤츠를 타고 계시면 ‘벤츠 재구매 할인’(차종별 +1% 또는 +2%, 마이바흐 S 680·GLS 600 최대 +9%) 대상일 수 있습니다. 타시던 벤츠를 인증중고차로 파시면 +1% 추가.',
           other: '타 프리미엄 브랜드를 타고 계시면 GLC·GLE ‘타 브랜드 보유 할인’ +1%, 마이바흐 S 680·GLS 600 은 +7% 대상일 수 있습니다.',
           none: '보유 차량 조건 없이도 차종별 현금 할인과 이달 상향된 할인을 받으실 수 있습니다.' },
    pay: { cash: '현금 구매: 모델별 현금 할인과 골든타임 사은품(계약 후 7일 이내 완납 시)을 확인하세요.',
           fin: '금융 구매: 모델별 ‘벤츠 금융 이용 시 추가 할인’과 안심보장할부 월 납입금 지원(첫 6개월 한도 내)을 확인하세요.',
           rent: '장기렌트: 모델별 장기렌트 추가 할인(+4~6%)과 전기차 충전 바우처를 확인하세요.' }
  };
  function val(n) { var r = box.querySelector('input[name="' + n + '"]:checked'); return r ? r.value : ''; }
  function apply() {
    var car = val('car'), pay = val('pay');
    document.querySelectorAll('.case[data-case]').forEach(function (c) {
      var on = (car === 'benz' && (c.dataset.case === 'benz' || c.dataset.case === 'tradein')) || (car === 'other' && c.dataset.case === 'other');
      c.classList.toggle('on', on); c.classList.toggle('dim', car !== 'none' && !on);
    });
    document.querySelectorAll('[data-pay]').forEach(function (s) { s.classList.toggle('pay-on', s.dataset.pay === pay); });
    if (out) out.textContent = MSG.car[car] + ' ' + MSG.pay[pay];
  }
  box.addEventListener('change', apply); apply();
})();
