'use strict';

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
      slideDown(box);
      show = false;
    } else {
      slideUp(box);
      show = true;
    }
  });
}

function mobileHistorySlide() {
  let start_y, end_y;
  const box = document.querySelector('.account__history');
  const btn = document.querySelector('.history-slide');

  const touch = {
    start : (event) => {
      start_y = event.touches[0].pageY;
    },
    end : (event) => {
      end_y = event.changedTouches[0].pageY;
      if(start_y > end_y) {
        slideUp(box);
      } else {
        slideDown(box);
      }
    }
  };

  btn.addEventListener("touchstart", touch.start);
  btn.addEventListener("touchend", touch.end);
}

function slideUp(box) {
  box.classList.add('on');
}

function slideDown(box) {
  box.classList.remove('on');
}
