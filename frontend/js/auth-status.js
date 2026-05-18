document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('buff_token');
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        if (token) {
            authBtn.innerHTML = `<a class="btn btn-login w-100" href="#" onclick="localStorage.removeItem('buff_token'); localStorage.removeItem('buff_session'); localStorage.removeItem('buff_sessionId'); localStorage.removeItem('buff_user'); window.location.href = 'index.html';"><i class="fas fa-sign-out-alt mr-2"></i>Sign Out</a>`;
        } else {
            authBtn.innerHTML = `<a class="btn btn-login w-100" href="login.html"><i class="fas fa-sign-in-alt mr-2"></i>Log In</a>`;
        }
    }
});
