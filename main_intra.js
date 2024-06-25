function checkSvgElement() {
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 25 25");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");

  svg.innerHTML =
    '<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>';

  return svg;
}

function crossSvgElement() {
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");

  svg.innerHTML =
    '<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="currentColor"></path> </g>';

  return svg;
}

var timeout_id = null;

const onSelectLogin = (login, img) => () => {
  console.log("ouiiiiiiiii   ");
  chrome.storage.local.get("access_token", ({ access_token }) => {
    chrome.storage.local.get("me", ({ me }) => {
      fetch("https://144.24.205.159:8000/friend_requests/send", {
        method: "POST",
        body: JSON.stringify({
          receiver_login: login,
          receiver_img: img,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          chrome.storage.local.set({ me: data });
        })
        .catch((error) => console.error("Error:", error));
    });
  });
};

function onSearch(e) {
  const addFriendSuggestion = document.getElementById("addFriendSuggestion");

  while (addFriendSuggestion.firstChild)
    addFriendSuggestion.removeChild(addFriendSuggestion.firstChild);
  if (timeout_id) clearTimeout(timeout_id);
  timeout_id = setTimeout(() => {
    timeout_id = null;
    fetch(
      `https://profile.intra.42.fr/searches/search.json?query=${e.target.value}`
    )
      .then((res) => res.json())
      .then((res) => {
        for (const index in res) {
          const user = res[index];

          const addFriendSuggestionItem = document.createElement("a");
          addFriendSuggestionItem.className =
            "search-suggestion-item tt-suggestion tt-selectable";
          addFriendSuggestionItem.style = "cursor: pointer;";
          addFriendSuggestionItem.addEventListener(
            "click",
            onSelectLogin(user.login, user.cdn_uri)
          );

          const addFriendSuggestionItemImage = document.createElement("div");
          addFriendSuggestionItemImage.className =
            "search-user-picture bg-image-item rounded square-xs";
          addFriendSuggestionItemImage.style = `background-image: url(${user.cdn_uri})`;

          const addFriendSuggestionItemLogin = document.createElement("span");
          addFriendSuggestionItemLogin.style = "font-size: 12px;";
          addFriendSuggestionItemLogin.textContent = user.login;

          addFriendSuggestionItem.appendChild(addFriendSuggestionItemImage);
          addFriendSuggestionItem.appendChild(addFriendSuggestionItemLogin);

          addFriendSuggestion.appendChild(addFriendSuggestionItem);
        }
      });
  }, 500);
}

function userElement(login, image, actions = undefined) {
  const element = document.createElement("a");
  element.className = "search-suggestion-item tt-suggestion tt-selectable";

  const elementTitle = document.createElement("div");
  elementTitle.style = "display: flex; cursor: pointer; font-size: inherit";
  elementTitle.addEventListener(
    "click",
    () => (window.location.href = `https://profile.intra.42.fr/users/${login}`)
  );

  const elementImage = document.createElement("div");
  elementImage.className =
    "search-user-picture bg-image-item rounded square-xs";
  elementImage.style = `background-image: url(${image})`;

  const elementName = document.createElement("span");
  elementName.textContent = login;

  elementTitle.appendChild(elementImage);
  elementTitle.appendChild(elementName);
  element.appendChild(elementTitle);
  if (actions) element.appendChild(actions);
  return element;
}

function addFriendsList(me) {
  const friendList = document.getElementById("friendList");

  while (friendList.firstChild) friendList.removeChild(friendList.firstChild);

  const friend_requests_received = [];
  if (me.friend_requests_received.length) {
    for (let index = 0; index < me.friend_requests_received.length; index++) {
      const friend_request = me.friend_requests_received[index];

      const elementActions = document.createElement("div");
      elementActions.style = "margin-left: auto; display: flex;";

      const rejectRequestAction = document.createElement("div");
      rejectRequestAction.style = "padding: 1px; cursor: pointer; display: flex; align-items: center";
      rejectRequestAction.addEventListener("mouseenter", () =>
        document
          .getElementById(`${friend_request.sender.login}_reject_action_svg`)
          .setAttribute("color", "red")
      );
      rejectRequestAction.addEventListener("mouseleave", () =>
        document
          .getElementById(`${friend_request.sender.login}_reject_action_svg`)
          .setAttribute("color", "black")
      );
      rejectRequestAction.addEventListener('click', (e) => {
        e.stopPropagation()
        alert('reject friend req')
      })

      const rejectRequestActionImage = crossSvgElement();
      rejectRequestActionImage.setAttribute(
        "id",
        `${friend_request.sender.login}_reject_action_svg`
      );
      rejectRequestActionImage.setAttribute("color", "black");

      rejectRequestAction.appendChild(rejectRequestActionImage);

      const acceptRequestAction = document.createElement("div");
      acceptRequestAction.style = "padding: 1px; cursor: pointer; display: flex; align-items: center";
      acceptRequestAction.addEventListener("mouseenter", () =>
        document
          .getElementById(`${friend_request.sender.login}_accept_action_svg`)
          .setAttribute("color", "green")
      );
      acceptRequestAction.addEventListener("mouseleave", () =>
        document
          .getElementById(`${friend_request.sender.login}_accept_action_svg`)
          .setAttribute("color", "black")
      );
      acceptRequestAction.addEventListener('click', (e) => {
        e.stopPropagation()
        alert('accept friend req')
      })

      const acceptRequestActionImage = checkSvgElement();
      acceptRequestActionImage.setAttribute(
        "id",
        `${friend_request.sender.login}_accept_action_svg`
      );
      acceptRequestActionImage.setAttribute("color", "black");

      acceptRequestAction.appendChild(acceptRequestActionImage);

      elementActions.appendChild(acceptRequestAction);
      elementActions.appendChild(rejectRequestAction);

      console.log(friend_request);

      const userElementObj = userElement(
        friend_request.sender.login,
        friend_request.sender.image,
        elementActions
      );

      friend_requests_received.push(userElementObj);
    }
  }

  for (let index = 0; index < friend_requests_received.length; index++) {
    friendList.appendChild(friend_requests_received[index]);
  }
}

function refreshFriendRequestsSentList(me) {
  const friendRequestsSentList = document.getElementById(
    "friendRequestsSentList"
  );

  while (friendRequestsSentList.firstChild)
    friendRequestsSentList.removeChild(friendRequestsSentList.firstChild);
  console.log(me.friend_requests_sent);
  for (let index = 0; index < me.friend_requests_sent.length; index++) {
    const friendRequestSent = me.friend_requests_sent[index];

    const user = friendRequestSent.receiver ?? friendRequestSent.receiver_waiting;

    console.log(user.login)

    const rejectRequestAction = document.createElement("div");
    rejectRequestAction.style = "padding: 1px; cursor: pointer; display: flex; align-items: center; margin-left: auto";
    rejectRequestAction.addEventListener("mouseenter", () =>
      document
        .getElementById(`${user.login}_reject_action_svg`)
        .setAttribute("color", "red")
    );
    rejectRequestAction.addEventListener("mouseleave", (e) =>
      document
        .getElementById(`${user.login}_reject_action_svg`)
        .setAttribute("color", "black")
    );
    rejectRequestAction.addEventListener('click', (e) => {
      e.stopPropagation()
      alert('remove friend req')
    })

    const rejectRequestActionImage = crossSvgElement();
    rejectRequestActionImage.setAttribute(
      "id",
      `${user.login}_reject_action_svg`
    );
    rejectRequestActionImage.setAttribute("color", "black");

    rejectRequestAction.appendChild(rejectRequestActionImage);

    const userElementObj = userElement(
      user.login,
      user.image,
      rejectRequestAction
    );
    userElementObj.style = "font-size: 12px;";

    friendRequestsSentList.appendChild(userElementObj);
  }
}

function friendRequestsSent() {
  const friendRequestsSentSpan = document.createElement("span");
  friendRequestsSentSpan.className = "dropdown event_search_dropdown";
  friendRequestsSentSpan.setAttribute("id", "friendRequestsSentSpan");

  const friendRequestsSentLabel = document.createElement("a");
  friendRequestsSentLabel.className = "dropdown-toggle btn simple-link";
  friendRequestsSentLabel.setAttribute("id", "dropdownMenuLink");
  friendRequestsSentLabel.setAttribute("data-toggle", "dropdown");
  friendRequestsSentLabel.setAttribute("href", "#");
  friendRequestsSentLabel.setAttribute("role", "button");
  friendRequestsSentLabel.setAttribute("aria-expanded", "false");
  friendRequestsSentLabel.textContent = "Friend Request Send ▾";

  const friendRequestsSentModal = document.createElement("div");
  friendRequestsSentModal.className = "dropdown-menu pull-right";
  friendRequestsSentModal.setAttribute("aria-labelledby", "dropdownMenuLink");
  friendRequestsSentModal.setAttribute(
    "style",
    "top: 31px; padding: 0px 0px; min-width: 150px; font-size: unset"
  );
  friendRequestsSentModal.setAttribute("id", "dropdownMenuLink");

  const friendRequestsSentModalElement = document.createElement("div");
  friendRequestsSentModalElement.className = "event_search_form ul";
  friendRequestsSentModalElement.setAttribute("style", "text-align: center");

  const friendRequestsSentModalElementLoginTitle =
    document.createElement("div");
  friendRequestsSentModalElementLoginTitle.textContent =
    " Friend Request Send ";
  friendRequestsSentModalElementLoginTitle.style =
    "padding: 5px 5px; padding-top: 10px";

  const friendRequestsSentList = document.createElement("div");
  friendRequestsSentList.classList = "overflowable-item";
  friendRequestsSentList.setAttribute("id", "friendRequestsSentList");

  friendRequestsSentModalElement.appendChild(
    friendRequestsSentModalElementLoginTitle
  );
  friendRequestsSentModalElement.appendChild(friendRequestsSentList);
  friendRequestsSentModal.appendChild(friendRequestsSentModalElement);
  friendRequestsSentSpan.appendChild(friendRequestsSentLabel);
  friendRequestsSentSpan.appendChild(friendRequestsSentModal);

  document
    .getElementById("friendContainerActions")
    .appendChild(friendRequestsSentSpan);
}

function addFriendToggle() {
  const addFriendSpan = document.createElement("span");
  addFriendSpan.className = "dropdown event_search_dropdown";
  addFriendSpan.setAttribute("id", "addFriendSpan");

  const addFriendLabel = document.createElement("a");
  addFriendLabel.className = "dropdown-toggle btn simple-link";
  addFriendLabel.setAttribute("id", "dropdownMenuLink");
  addFriendLabel.setAttribute("data-toggle", "dropdown");
  addFriendLabel.setAttribute("href", "#");
  addFriendLabel.setAttribute("role", "button");
  addFriendLabel.setAttribute("aria-expanded", "false");
  addFriendLabel.textContent = "Add friend ▾";
  addFriendLabel.addEventListener("click", () => {
    setTimeout(() => {
      document.getElementById("addFriendModalElementLoginInput").focus();
    }, 100);
  });

  const addFriendModal = document.createElement("div");
  addFriendModal.className = "dropdown-menu pull-right";
  addFriendModal.setAttribute("aria-labelledby", "dropdownMenuLink");
  addFriendModal.setAttribute(
    "style",
    "top: 31px; padding: 0px 0px; min-width: 150px; font-size: unset"
  );
  addFriendModal.setAttribute("id", "dropdownMenuLink");

  const addFriendModalElement = document.createElement("div");
  addFriendModalElement.className = "event_search_form ul";
  addFriendModalElement.setAttribute("style", "text-align: center");

  const addFriendModalElementLoginTitle = document.createElement("div");
  addFriendModalElementLoginTitle.textContent = " Login ";
  addFriendModalElementLoginTitle.style = "padding: 5px 5px; padding-top: 10px";

  const addFriendModalElementLoginInput = document.createElement("input");
  addFriendModalElementLoginInput.type = "text";
  addFriendModalElementLoginInput.style = "outline: none;";
  addFriendModalElementLoginInput.setAttribute(
    "id",
    "addFriendModalElementLoginInput"
  );

  addFriendModalElementLoginInput.addEventListener("input", onSearch);

  const addFriendSuggestion = document.createElement("div");
  addFriendSuggestion.setAttribute("id", "addFriendSuggestion");
  addFriendSuggestion.style =
    "display: flex; flex-direction: column; gap: 1rem;";

  addFriendModalElementLoginTitle.appendChild(addFriendModalElementLoginInput);
  addFriendModalElement.appendChild(addFriendModalElementLoginTitle);
  addFriendModalElement.appendChild(addFriendSuggestion);
  addFriendModal.appendChild(addFriendModalElement);
  addFriendSpan.appendChild(addFriendLabel);
  addFriendSpan.appendChild(addFriendModal);

  document.getElementById("friendContainerActions").appendChild(addFriendSpan);
}

function addFriendContainer() {
  if (document.getElementById("friendContainer")) {
    document.getElementById("friendContainer").setAttribute("style", "");
    return;
  }

  const row = document.getElementsByClassName(
    "container-fullsize full-width fixed-height"
  )[0].children[0];

  const friendContainer = document.createElement("div");
  friendContainer.className = "col-lg-4 col-md-6 col-xs-12 fixed-height";
  friendContainer.setAttribute("id", "friendContainer");

  const friendElement = document.createElement("div");
  friendElement.className = "container-inner-item boxed";

  const friendTitle = document.createElement("h4");
  friendTitle.className = "profile-title";
  friendTitle.textContent = " Friends ";

  const pullRight = document.createElement("span");
  pullRight.className = "pull-right";
  pullRight.style = "display: flex; gap: 2px";
  pullRight.setAttribute("id", "friendContainerActions");

  friendTitle.appendChild(pullRight);
  friendElement.appendChild(friendTitle);

  const friendList = document.createElement("div");
  friendList.classList = "overflowable-item";
  friendList.setAttribute("id", "friendList");

  friendElement.appendChild(friendList);
  friendContainer.appendChild(friendElement);

  row.insertBefore(friendContainer, row.firstChild);
}

function onDisconnect() {}

console.log("test");

addFriendContainer();
chrome.storage.local.get("me", ({ me }) => {
  chrome.storage.local.onChanged.addListener((changes) => {
    console.log("changes", changes);
    if (changes.me && changes.me.newValue != null) {
      if (changes.me.oldValue == null) {
        friendRequestsSent(changes.me.newValue);
    addFriendToggle();
  }
      addFriendsList(changes.me.newValue);
      refreshFriendRequestsSentList(changes.me.newValue);
    } else onDisconnect();
  });
  console.log("me", me);
  if (me != null) {
    addFriendsList(me);
    friendRequestsSent();
    refreshFriendRequestsSentList(me);
    addFriendToggle();
  }
});
