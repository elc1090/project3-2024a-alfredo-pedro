const baseUrl = 'https://resume-back-zwhd.onrender.com/';

window.addEventListener('beforeunload', function(event) {
    // Check if the navigation is external (different domain)
    if (event.currentTarget.location.href !== window.location.href) {
        // Check if the destination URL is not your site
        if (!isInternalURL(event.currentTarget.location.href)) {
            //logout();
        }
    }
});

function isInternalURL(url) {
    // Implement logic to check if the URL belongs to your site
    return url.startsWith(baseUrl);
}


async function logout() {
    fetch(`${baseUrl}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error logging out: ', data.error);
            } else {
                console.log('User logged out successfully.');
            }
        });
}