"use strict";

const maxAttempts = 50;
const darkBlueColor = '#151c2b';
let sticky = true;
let darkMode = false;
let activeMachine = null;
let header1 = null;
let scrollHandler = null;
let resizeHandler = null;
let panelObserverInstance = null;

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

const addButtons = (targetUrl) => {
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
              <button color="secondary" type="button" role="button" class="lock-scroll-button" aria-label="lock-scroll-button">
              </button>
            `;

            const darkButtonHTML = `
              <button color="secondary" type="button" role="button" class="dark-button" aria-label="dark-button">
              </button>
            `;

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = buttonHTML;

            const tempDarkDiv = document.createElement("div");
            tempDarkDiv.innerHTML = darkButtonHTML;

            const button = tempDiv.firstElementChild;
            const darkButton = tempDarkDiv.firstElementChild;

            // Base STYLE
            const baseButtonStyle = {
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.5rem",
              display: "inline-flex",
              maxWidth: "100%",
              fontSize: "1.6rem",
              gap: "0.6rem",
              height: "3.6rem",
              transition: "0.2s ease-in-out",
              textDecoration: "none",
              padding: "0.9rem 1.6rem",
              pointerEvents: "initial",
              borderWidth: "0.1rem",
              borderStyle: "solid",
              backgroundColor: "transparent",
              borderColor: "rgb(62, 71, 90)",
              color: "rgb(21, 28, 43)",
              cursor: "pointer"
            };

            Object.assign(button.style, baseButtonStyle);
            Object.assign(darkButton.style, baseButtonStyle);

            // Hover STYLE
            button.addEventListener("mouseenter", () => {
              button.style.backgroundColor = "rgb(238, 239, 242)";
              button.style.borderColor = "rgb(238, 239, 242)";
            });

            button.addEventListener("mouseleave", () => {
              button.style.backgroundColor = "transparent";
              button.style.borderColor = "rgb(62, 71, 90)";
            });

            darkButton.addEventListener("mouseenter", () => {
              darkButton.style.backgroundColor = "rgb(238, 239, 242)";
              darkButton.style.borderColor = "rgb(238, 239, 242)";
            });

            darkButton.addEventListener("mouseleave", () => {
              darkButton.style.backgroundColor = "transparent";
              darkButton.style.borderColor = "rgb(62, 71, 90)";
            });
    
            // Button STYLE
            button.innerText = sticky ? "📌" : "🔓";
            darkButton.innerText = "🌙";
            switcher(button, el);

            button.addEventListener("click", () => {
              if (button.innerText == "📌") {
                chrome.storage.local.set({ sticky: false });
                button.innerText = "🔓";
                sticky = false;
              } else {
                chrome.storage.local.set({ sticky: true });
                button.innerText = "📌";
                sticky = true;
              }
              switcher(button, el);
            });

            darkButton.addEventListener("click", () => {
              toggleDarkMode()
            })

            el.append(button, darkButton);
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
  if (panelObserverInstance) return;

  panelObserverInstance = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-panel-size') {
        const button = document.querySelector('.lock-scroll-button');
        const el = document.querySelector('[data-sentry-component="RoomBannerActions"]');
        if (button && el) {
          switcher(button, el);
          targetMachine();
        }
      }
    }
  });

  panelObserverInstance.observe(rightPanel, {attributes: true,attributeFilter: ['data-panel-size']});
};

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
  addButtons(targetUrl);
  targetMachine();
  rightPanel();
});

// Direct THM room link
if (location.href.includes("room")) {
  addButtons(location.href);
  targetMachine();
  rightPanel();
}

function waitForElement(selector) {
  return new Promise(resolve => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

async function toggleDarkMode() {
  const btn = document.querySelector('[aria-label="Toggle avatar dropdown"]');
  if (!btn) return;

  btn.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
  // console.log("Open");

  const darkBtn = await waitForElement('[aria-label="Toggle dark mode"]');

  // cible le dropdown parent le plus probable
  const dropdown = darkBtn.closest('[dir="ltr"]');

  if (dropdown) {
    dropdown.style.display = "none";
  }

  darkBtn.click();

  btn.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
  // console.log("Close");
}