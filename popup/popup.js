const buttons = {
	login: document.getElementById('loginButton'),
	logout: document.getElementById('logoutButton')
}

function onLogout() {
	chrome.storage.local.set({ 'access_token': '' })
	window.close()
}

async function getMe(token) {
	console.log(token)
	console.log('fetch')
	return fetch('https://144.24.205.159:8000/users/me', {headers: {
		Authorization: `bearer ${token}`
	}}).then(res => res.json()).then(res => chrome.storage.local.set({'me': res})).catch(err => getMe(token))
}



chrome.storage.local.get('access_token', ({ access_token }) => {
	if (!access_token) {
		buttons.login.addEventListener('click', async () => {
			(async () => {
				const tab = await chrome.tabs.query({active: true});
				console.log(tab[0].url);

				if (tab[0].url != 'https://profile.intra.42.fr/')
					chrome.tabs.create({ url: "https://profile.intra.42.fr/" });
				else {
					const popup = window.open('', '_blank', 'width=600,height=600');
					window.addEventListener('message', function (event) {
						const accessToken = event.data.access_token;
						if (accessToken) {
							chrome.storage.local.set({ 'access_token': accessToken }, () => 
								{
									getMe(accessToken).then(() => {

										popup.close()
										window.close()
									})
								});
							}
						});
						popup.location.href = "https://144.24.205.159:8000/users/login"
					}
		})();
	})
	}
	else {
		fetch("https://144.24.205.159:8000/users/me", {headers: {Authorization: `Bearer ${access_token}`}}).then(res => res.json()).then(user => {
			buttons.login.style = "display: none;"
			buttons.logout.style = "display: block;"
			buttons.logout.addEventListener('click', onLogout)
			document.getElementById('title').textContent += user.login + ' !'
			// document.storage.local.set({me: user})
		}).catch(err => onLogout())
	}
})
	
