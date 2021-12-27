'use strict';

// 사용자 기기 체크
const isMobile = () => { 
  try { 
    document.createEvent("TouchEvent"); 
    return true; 
  } catch (e) { 
    return false; 
  } 
};
if(isMobile()) {
  mobileHistorySlide();
} else {
  pcHistorySlide();
}

// pc버전 입출금 내역 올림 (클릭 방식) 
function pcHistorySlide() {
  const box = document.querySelector('.account__history');
  const recent = box.querySelector('.history__recent');
  const btn = document.querySelector('.history-slide');
  let show = false;

  btn.addEventListener("click", () => {
    if(show) {
      box.style.top = `89px`;
      recent.classList.add('on');
      show = false;
    } else {
      box.style.top = `353px`;
      recent.classList.remove('on');
      show = true;
    }
  });
}

// 모바일버전 입출금 내역 올림 (터치 방칙)
function mobileHistorySlide() {
  let start_y, move_y, end_y;
  const box = document.querySelector('.account__history');
  const recent = box.querySelector('.history__recent');
  const btn = document.querySelector('.history-slide');

  const touch = {
    start : (event) => {
      start_y = event.touches[0].pageY;
    },
    move : (event) => {
      move_y = event.changedTouches[0].pageY;
      if (move_y < 353 && move_y > 89) {
        box.style.top = `${move_y}px`;
      }
    },
    end : (event) => {
      end_y = event.changedTouches[0].pageY;
      if(start_y - end_y > 20) {
        box.style.top = `89px`;
        recent.classList.add('on');
      } else {
        box.style.top = `353px`;
        recent.classList.remove('on');
      }
    }
  };

  btn.addEventListener("touchstart", touch.start);
  btn.addEventListener("touchmove", touch.move);
  btn.addEventListener("touchend", touch.end);
}

// 메인 홈 스와이퍼
new Swiper('.account-swiper');
new Swiper('.history__saving', {
  spaceBetween: 13,
  breakpoints: {
    375: {
      slidesPerView: 1.8,
    },
    450: {
      slidesPerView: 3,
    }
  }
});

// json bank 리스트
fetch('../bank.json')
  .then(res => res.json())
  .then(json => getBankList(json));

function getBankList(data) {
  const list = data.bankList;
  list.reverse();
  getDayList(list);
}

// json data -> array 정렬 
function groupBy(array, property) {
  return array.reduce( (acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

// 지출 내역 리스트 돔 생성 및 출력
function getDayList(list) {
  const dayCount = groupBy(list, 'date');
  Object.keys(dayCount).forEach( day => {
    const dayArr = dayCount[day];

    const dayInfo = document.createElement('div');
    dayInfo.classList.add('day__info');
    const infoDate = document.createElement('strong');
    infoDate.textContent = getDayDate(day);
    dayInfo.appendChild(infoDate);
    const dayUl = document.createElement('ul');

    let totalPay = 0;
    for (let i = 0; i < dayArr.length; i++) {
      const pay = dayArr[i].price;
      const income = dayArr[i].income;
      totalPay = (income == 'in') ? totalPay += pay : totalPay -= pay;
      const price = document.createElement('span');
      (income == 'in') ? price.classList.add('price', 'plus') : price.classList.add('price');
      price.textContent = (income == 'in') ? `+ ${pay}` : pay;
      const dayLi = document.createElement('li');
      dayLi.textContent = dayArr[i].history;
      dayLi.appendChild(price);
      dayUl.appendChild(dayLi);
    }

    const totalSpend = document.createElement('span');
    totalSpend.classList.add('total-spend');
    totalSpend.textContent = `${totalPay.toLocaleString()}원 지출`;
    dayInfo.appendChild(totalSpend);
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.appendChild(dayInfo);
    dayDiv.appendChild(dayUl);
    const dayWrap = document.querySelector('.history__recent');
    dayWrap.appendChild(dayDiv);
  });
}

// 날짜 비교 및 일자 계산
function getDayDate(time) {
  const dt = new Date();
  const today = new Date(`${dt.getFullYear()} ${dt.getMonth()+1} ${dt.getDate()}`);
  const dateList = time.split('-');
  const date = new Date(dateList[0], dateList[1], dateList[2]);
  const gap = today.getTime() - date.getTime();
  const gapResult = gap / (1000*60*60*24);
  const dateName = (gapResult === 51) ? `오늘` :
    (gapResult === 52) ? `어제` :
    `${gapResult-51}일전`;
    
  return dateName;
}

// popup 
function showPop() {
  const popup = document.querySelector('.popup');
  const show = popup.classList.contains('show');
  if ( show == false ) {
    popup.classList.add('show');
  } else {
    popup.classList.remove('show');
  }
}

// chart
const dailyReport = document.querySelector('#dailyReport');
const monthPattern = document.querySelector('#monthPattern');

const dailReportChart = new Chart (dailyReport, {
  data: {
    labels: ['one', 'two', 'three'],
    datasets: [{
      type: 'bar',
      data: [5, 9, 7],
      backgroundColor: '#38C976',
      barThickness: 5,
      borderRadius: 4,
    }, {
      type: 'line',
      data: [4, 7, 9],

    }]
  }
});
const monthPatternChart = new Chart (monthPattern, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [25, 15, 20, 30, 10],
      backgroundColor: [
        '#BD5B00',
        '#0057BD',
        '#00BDB2',
        '#FEC229',
        '#C4C4C4'
      ],
      borderWidth: 0
    }]
  },
});