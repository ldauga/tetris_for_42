console.log("SWSWSWSWSWSWSWSWSWSWSWSWS");
console.log("SWSWSWSWSWSWSWSWSWSWSWSWS");
console.log("SWSWSWSWSWSWSWSWSWSWSWSWS");
console.log("SWSWSWSWSWSWSWSWSWSWSWSWS");
console.log("SWSWSWSWSWSWSWSWSWSWSWSWS");

function getMe(token) {
	fetch('https://144.24.205.159:8000/users/me', {headers: {
		Authorization: `bearer ${token}`
	}}).then(res => res.json()).then(res => chrome.storage.local.set({'me': res})).catch(err => console.log(err))
}

chrome.storage.local.get("access_token", ({ access_token }) => {
  chrome.storage.local.onChanged.addListener(function (changes) {
    if (changes.access_token && changes.access_token.newValue)
		getMe(changes.access_token.newValue)
	else if (changes.access_token && !changes.access_token.newValue)
		chrome.storage.local.set({'me': null})
  });
  if (access_token) {
	getMe(access_token)
  };
});
