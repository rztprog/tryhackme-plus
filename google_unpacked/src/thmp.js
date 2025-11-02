"use strict";

const maxAttempts = 50;
const darkBlueColor = '#151c2b';
let sticky = true;
let activeMachine = null;
let header1 = null;
let scrollHandler = null;
let resizeHandler = null;

chrome.storage.local.get(['sticky'], (result) => { 
  if (typeof result.sticky === 'boolean') { 
    sticky = result.sticky; 
  } else {
    sticky = true;
  } 
});

const switcher = (button, el) => {
  const splitScreenMiddle = document.getElementById("split-screen-middle"); // Scrollable div
  const room = document.getElementById("room_content");
  const roomComputedStyle = window.getComputedStyle(room);
  let scrolled = splitScreenMiddle.scrollTop;

  if (scrollHandler) splitScreenMiddle.removeEventListener("scroll", scrollHandler);
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);

  if (button.innerText === "📌") {
    const applyStyles = () => {
      el.style.position = "fixed";
      el.style.backgroundColor = darkBlueColor;
      el.style.maxWidth = "1296px";
      el.style.width = roomComputedStyle.width;
      el.style.padding = "10px";
      el.style.top = "16px";
      el.style.marginRight = "1.7rem";
    };

    const resetStyles = () => {
      el.style.position = "";
      el.style.backgroundColor = "";
      el.style.width = "";
      el.style.maxWidth = "";
      el.style.padding = "";
      el.style.top = "";
      el.style.marginRight = "";
    };

    scrollHandler = () => {
      if (!sticky) return;
      scrolled = splitScreenMiddle.scrollTop;
      if (
        (scrolled > 408 && window.innerWidth < 1023) ||
        (scrolled > 390 && window.innerWidth > 1023)
      ) {
        applyStyles();
      } else {
        resetStyles();
      }
    };

    resizeHandler = () => {
      if (!sticky) return;
      el.style.width = window.getComputedStyle(room).width;
    };

    splitScreenMiddle.addEventListener("scroll", scrollHandler);
    window.addEventListener("resize", resizeHandler);

    scrollHandler();
  } else {
    // Flush styles and listeners
    el.style.position = "";
    el.style.backgroundColor = "";
    el.style.width = "";
    el.style.maxWidth = "";
    el.style.padding = "";
    el.style.top = "";
    el.style.marginRight = "";

    if (activeMachine) {
      header1.style.marginTop = "";
      activeMachine.style.position = "";
      activeMachine.style.width = "";
      activeMachine.style.maxWidth = "";
      activeMachine.style.zIndex = "";
      activeMachine.style.top = "";
      activeMachine.style.padding = "";
      activeMachine.style.marginRight = "";
      activeMachine.style.border = "";
      activeMachine = null;
    }

    if (scrollHandler) splitScreenMiddle.removeEventListener("scroll", scrollHandler);
    if (resizeHandler) window.removeEventListener("resize", resizeHandler);

    scrollHandler = null;
    resizeHandler = null;
  }

  return;
}

const targetMachine = () => {
  let counter = 0;
  const timer = setInterval(() => {
    const activeMachineInfo = document.getElementById('active-machine-info');
    if (activeMachineInfo) {
      // console.log('activeMachineInfo Appear !');
      const splitScreenMiddle = document.getElementById("split-screen-middle"); // Scrollable div
      const room = document.getElementById("room_content");
      const roomComputedStyle = window.getComputedStyle(room);
      header1 = document.getElementById('header-1');
      let scrolled = splitScreenMiddle.scrollTop;
      activeMachine = activeMachineInfo;

      if (scrolled > 500 && sticky) {
        header1.style.marginTop = "120px";
        activeMachineInfo.style.position = "fixed";
        activeMachineInfo.style.maxWidth = "1296px";
        activeMachineInfo.style.width = roomComputedStyle.width;
        activeMachineInfo.style.zIndex = "999";
        window.innerWidth > 1177 ? activeMachineInfo.style.top = "72px" : activeMachineInfo.style.top = "120px";
        window.innerWidth < 712 ? activeMachineInfo.style.top = "168px" : "";
        activeMachineInfo.style.padding = "10px";
        activeMachineInfo.style.marginRight = "1.7rem";
        activeMachineInfo.style.border = `1px solid ${darkBlueColor}`;
      }

      splitScreenMiddle.addEventListener("scroll", () => {
        if (!sticky) return; // Guard clause
        // console.log('scrollTop:',scrolled);
        scrolled = splitScreenMiddle.scrollTop;

        if ((scrolled > 500 && window.innerWidth > 1023) || (scrolled > 550 && window.innerWidth < 1023)) {
          window.addEventListener("resize", () => {
            activeMachineInfo.style.width = roomComputedStyle.width;
            window.innerWidth > 1177 ? activeMachineInfo.style.top = "72px" : activeMachineInfo.style.top = "120px";
            window.innerWidth < 712 ? activeMachineInfo.style.top = "168px" : "";
          });

          header1.style.marginTop = "120px";
          activeMachineInfo.style.position = "fixed";
          activeMachineInfo.style.maxWidth = "1296px";
          activeMachineInfo.style.width = roomComputedStyle.width;
          activeMachineInfo.style.zIndex = "999";
          window.innerWidth > 1177 ? activeMachineInfo.style.top = "72px" : activeMachineInfo.style.top = "120px";
          window.innerWidth < 712 ? activeMachineInfo.style.top = "168px" : "";
          activeMachineInfo.style.padding = "10px";
          activeMachineInfo.style.marginRight = "1.7rem";
          activeMachineInfo.style.border = `1px solid ${darkBlueColor}`;
        } else {
          header1.style.marginTop = "";
          activeMachineInfo.style.position = "";
          activeMachineInfo.style.width = "";
          activeMachineInfo.style.maxWidth = "";
          activeMachineInfo.style.zIndex = "";
          activeMachineInfo.style.top = "";
          activeMachineInfo.style.padding = "";
          activeMachineInfo.style.marginRight = "";
          activeMachineInfo.style.border = "";
        }
      });
      
      clearInterval(timer);
      return;
    }
    
    counter++;
    if (counter >= maxAttempts) {
      // console.log('Stop when not found, 10sec');
      activeMachine = null;
      clearInterval(timer);
      return;
    }
  }, 200);
}

const addButton = (targetUrl) => {
  // Don't repeat button when click (Guard clause)
	if (document.querySelector(".lock-scroll-button")) {
		return;
	}

  if (targetUrl.includes("room")) {
    let counter = 0;

    const timer = setInterval(() => {
        const el = document.querySelector('[data-sentry-component="RoomBannerActions"]');

        if (el) {
          // console.log('RoomBannerActions detected');
          const lastChild = el.lastElementChild;
          if (!lastChild || !lastChild.classList.contains("lock-scroll-button")) {
            const buttonHTML = `
              <button color="secondary" type="button" role="button" style="border-color: rgb(62, 71, 90);"class="eyZCEe eCoJpk bpvDXh lock-scroll-button" aria-label="lock-scroll-button">
              </button>
            `;

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = buttonHTML;

            const button = tempDiv.firstElementChild;
            button.innerText = sticky ? "📌" : "🔒";
            switcher(button, el);
          
            button.addEventListener("click", () => {
              if (button.innerText == "📌") {
                chrome.storage.local.set({ sticky: false });
                button.innerText = "🔒";
                sticky = false;
              } else {
                chrome.storage.local.set({ sticky: true });
                button.innerText = "📌";
                sticky = true;
              }
              switcher(button, el);
            });

            el.appendChild(button);
            clearInterval(timer);
            return;
          }
        }

        counter++;
        if (counter >= maxAttempts) {
          // console.log('Stop when not found, 10sec');
          clearInterval(timer);
        }
    }, 200);
  }
}

// Click on Start Machine
document.addEventListener("click", (event) => {
	if (event.target.type === 'button' && event.target.innerText.trim() === 'Loading...') {
    // console.log('Start Machine clicked !');
    targetMachine();
	}
});

// Click on Start AttackBox
document.addEventListener("click", (event) => {
  let counter = 0;  
  const attackBoxButton = document.querySelector('[data-testid="start-attack-box-btn"]');

  if (event.target == attackBoxButton) {
    const timer = setInterval(() => {
      const rightPanel = document.querySelector('#right-panel');

      if (rightPanel) {
        panelObserver(rightPanel);

        console.log("loaded wait");
        setTimeout(() => {
          console.log("LAUNCH");
          const button = document.querySelector('.lock-scroll-button');
          const el = document.querySelector('[data-sentry-component="RoomBannerActions"]');
          switcher(button, el);
          targetMachine();
        }, 600);
  
        clearInterval(timer);
      }

      counter++;
      if (counter >= maxAttempts) {
        // console.log('Stop when not found, 10sec');
        clearInterval(timer);
      }
    }, 200);
  }
});

// Panel Observer
const panelObserver = (rightPanel) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-panel-size') {
        const button = document.querySelector('.lock-scroll-button');
        const el = document.querySelector('[data-sentry-component="RoomBannerActions"]');
        if (button && el && typeof switcher === 'function') {
          switcher(button, el);
          targetMachine();
        }
      }
    }
  });

  observer.observe(rightPanel, { attributes: true, attributeFilter: ['data-panel-size'] });
}

// Right Panel Detector
const rightPanel = () => {
  let counter = 0;  

  const timer = setInterval(() => {
    const rightPanel = document.querySelector('#right-panel');

    if (rightPanel) {

      panelObserver(rightPanel);
      clearInterval(timer);
    }

    counter++;
    if (counter >= maxAttempts) {
      // console.log('Stop when not found, 10sec');
      clearInterval(timer);
    }
  }, 200);
}

// Click on a THM room link
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  const targetUrl = link ? link.href : null;
  addButton(targetUrl);
  targetMachine();
  rightPanel();
});

// Direct THM room link
if (location.href.includes("room")) {
  addButton(location.href);
  targetMachine();
  rightPanel();
}
