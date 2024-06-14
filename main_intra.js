function addFriendContainer() {
    const row = document.getElementsByClassName("container-fullsize full-width fixed-height")[0].children[0]

    const friendContainer = document.createElement('div')
    friendContainer.className = "col-lg-4 col-md-6 col-xs-12 fixed-height"

    const friendElement = document.createElement('div')
    friendElement.className = "container-inner-item boxed"
    
    const friendTitle = document.createElement('h4')
    friendTitle.className = "profile-title"
    friendTitle.textContent = ' Friends '

    const addFriendSpan = document.createElement('span')
    addFriendSpan.className = "dropdown event_search_dropdown"

    const addFriendLabel = document.createElement('a')
    addFriendLabel.className = "dropdown-toggle btn simple-link"
    addFriendLabel.setAttribute("data-toggle", "dropdown")
    addFriendLabel.setAttribute("href", "#")
    addFriendLabel.setAttribute("role", "button")
    addFriendLabel.setAttribute("aria-expanded", "false")
    addFriendLabel.setAttribute("id", "addFriendLabel")
    addFriendLabel.textContent = "Filters ▾"
    
    const addFriendModal = document.createElement('div')
    addFriendModal.className = "dropdown-menu pull-right"
    addFriendModal.setAttribute("aria-labelledby", "addFriendLabel")
    addFriendModal.setAttribute("style", "top: 31px; padding: 0px 0px; min-width: 150px; font-size: unset")

    const addFriendModalElement = document.createElement('div')
    addFriendModalElement.className = "event_search_form ul"
    addFriendModalElement.setAttribute("style", "text-align: center")


    addFriendModal.appendChild(addFriendModalElement)
    addFriendSpan.appendChild(addFriendModal)
    addFriendSpan.appendChild(addFriendLabel)
    friendTitle.appendChild(addFriendSpan)
    friendElement.appendChild(friendTitle)
    friendContainer.appendChild(friendElement)



    row.insertBefore(friendContainer, row.firstChild)
}

addFriendContainer()