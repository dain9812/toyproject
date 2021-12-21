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
  .then(json => getList(json));

function getList(data) {
  const list = data.bankList;
  list.reverse();
  incomeList(list);
}

// 홈화면 입출금 내역
function incomeList(data) {
  let dateList, date, gap, gapResult, dateName;
  const dt = new Date();
  const year = dt.getFullYear();
  const month = dt.getMonth()+1;
  const day = dt.getDate();
  const today = new Date(`${year} ${month} ${day}`);
  data.forEach(e => {
    dateList = e.date.split('-');
    date = new Date(dateList[0], dateList[1], dateList[2]);
    gap = today.getTime() - date.getTime();
    gapResult = gap / (1000*60*60*24);
    // if (gapResult === '48') {
    //   dateName = '오늘';
    // } else if (gapResult === '49') {
    //   dateName = '어제';
    // }
    console.log(gapResult);
  });
  
}
