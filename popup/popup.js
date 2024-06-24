const buttons = {
	login: document.getElementById('loginButton'),
	logout: document.getElementById('logoutButton')
}

function onLogout() {
	chrome.storage.local.set({ 'access_token': '' })
	window.close()
}



chrome.storage.local.get('access_token', ({ access_token }) => {

	console.log(access_token)

	if (!access_token) {
		console.log(chrome.storage)
		buttons.login.addEventListener('click', async () => {
			const popup = window.open('', '_blank', 'width=600,height=600');

			window.addEventListener('message', function (event) {
				const accessToken = event.data.access_token;
				if (accessToken) {
					chrome.storage.local.set({ 'access_token': accessToken }, () => 
						{
							popup.close()
							window.close()
						});
				}
			});
			fetch("https://144.24.205.159:8000/users/login").then(res => res.json()).then(url => popup.location.href = url)
		});
	}
	else {
		fetch("https://144.24.205.159:8000/users/me", {headers: {Authorization: `Bearer ${access_token}`}}).then(res => res.json()).then(user => {
			buttons.login.style = "display: none;"
			buttons.logout.style = "display: block;"
			buttons.logout.addEventListener('click', onLogout)
			document.getElementById('title').textContent += user.login + ' !'
		}).catch(err => onLogout())
	}
})
