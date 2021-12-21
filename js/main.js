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

function pcHistorySlide() {
  const box = document.querySelector('.account__history');
  const btn = document.querySelector('.history-slide');
  let show = false;

  btn.addEventListener("click", () => {
    if(show) {
      box.style.top = `89px`;
      show = false;
    } else {
      box.style.top = `353px`;
      show = true;
    }
  });
}

function mobileHistorySlide() {
  let start_y, move_y, end_y;
  const box = document.querySelector('.account__history');
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
      } else {
        box.style.top = `353px`;
      }
    }
  };

  btn.addEventListener("touchstart", touch.start);
  btn.addEventListener("touchmove", touch.move);
  btn.addEventListener("touchend", touch.end);
}

new Swiper('.account-swiper');

new Swiper('.history__saving', {
  slidesPerView: 1.8,
  spaceBetween: 13,
});