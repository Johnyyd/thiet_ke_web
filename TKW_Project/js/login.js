document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    
    const loginContainer = document.querySelector('.login-container');
    
    const showRegisterLink = document.getElementById('show-register-link');
    const showForgotPasswordLink = document.getElementById('show-forgot-password-link');
    const backToLoginLinks = document.querySelectorAll('.back-to-login-link');
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    // Thêm biến để lưu vị trí ban đầu
    let initialButtonWidth = 0;
    let initialButtonTop = 0;
    let initialButtonLeft = 0;

    // Lưu lại ban đầu của nút để đưa nó về đúng chỗ.
    const loginBtnOriginalParent = loginBtn.parentElement;
    const loginBtnOriginalNextSibling = loginBtn.nextElementSibling;


    function showForm(formToShow) {
        const allForms = [loginForm, registerForm, forgotPasswordForm];
        allForms.forEach(form => {
            form.classList.toggle('hidden', form !== formToShow);
        });
    }

    const areFieldsFilled = () => {
        return emailInput.value.trim() !== '' && passwordInput.value.trim() !== '';
    };

    const runAway = () => {
        if (!loginBtn.classList.contains('running')) {
            const rect = loginBtn.getBoundingClientRect();

            // Lưu lại vị trí ban đầu
            initialButtonWidth = rect.width;
            initialButtonTop = rect.top;
            initialButtonLeft = rect.left;
            
            loginBtn.style.top = `${rect.top}px`;
            loginBtn.style.left = `${rect.left}px`;
            loginBtn.style.width = `${rect.width}px`;
            loginBtn.classList.add('running');
            
            loginContainer.classList.add('shrunken');

            document.body.appendChild(loginBtn);
        }

        setTimeout(() => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const buttonHeight = loginBtn.offsetHeight;
            
            const safeAreaWidth = viewportWidth * 0.75;
            const safeAreaHeight = viewportHeight * 0.75;
            const horizontalMargin = (viewportWidth - safeAreaWidth) / 2;
            const verticalMargin = (viewportHeight - safeAreaHeight) / 2;
            const randomLeft = horizontalMargin + (Math.random() * (safeAreaWidth - initialButtonWidth));
            const randomTop = verticalMargin + (Math.random() * (safeAreaHeight - buttonHeight));
            const randomRotation = (Math.random() - 0.5) * 40;

            loginBtn.style.top = `${randomTop}px`;
            loginBtn.style.left = `${randomLeft}px`;
            loginBtn.style.transform = `scale(0.6) rotate(${randomRotation}deg)`;
            loginBtn.style.background = 'linear-gradient(135deg, #FFD700, #E6C547)';
        }, 10);
    };

    const returnToHome = () => {
        if (!loginBtn.classList.contains('running')) return; 
        
        loginContainer.classList.remove('shrunken');

        loginBtn.style.top = `${initialButtonTop}px`;
        loginBtn.style.left = `${initialButtonLeft}px`;
        loginBtn.style.transform = ''; // Quay về trạng thái ban đầu
        loginBtn.style.background = ''; // Quay về màu ban đầu

        setTimeout(() => {
            // "Lắp" nút trở lại vị trí cũ trong form.
            loginBtnOriginalParent.insertBefore(loginBtn, loginBtnOriginalNextSibling);   
            loginBtn.classList.remove('running');
            loginBtn.style.top = '';
            loginBtn.style.left = '';
            loginBtn.style.width = '';
        }, 700); 
    };

    if (showRegisterLink) { showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showForm(registerForm); }); }
    if (showForgotPasswordLink) { showForgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); showForm(forgotPasswordForm); }); }
    backToLoginLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); }); });
    loginBtn.addEventListener('mouseover', () => { if (!areFieldsFilled()) { runAway(); } });
    [emailInput, passwordInput].forEach(input => { input.addEventListener('input', () => { if (areFieldsFilled()) { returnToHome(); } }); });
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!areFieldsFilled()) {
                alert('Vui lòng rượt bắt nút và điền đầy đủ thông tin! 😉');
                return;
            }
            loginBtn.innerHTML = '<span class="loading-spinner"></span>Đang đăng nhập...';
            loginBtn.disabled = true;
            setTimeout(() => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'success-message';
                messageDiv.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
                loginForm.insertBefore(messageDiv, loginForm.firstChild);
                setTimeout(() => { window.location.href = 'index.html'; }, 1500);
            }, 1000);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            const messageDiv = document.createElement('div');
            messageDiv.className = 'success-message';
            messageDiv.textContent = 'Tài khoản đã được tạo thành công! Chuyển về đăng nhập...';
            registerForm.insertBefore(messageDiv, registerForm.firstChild);
            setTimeout(() => {
                showForm(loginForm);
                messageDiv.remove();
            }, 2000);
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const messageDiv = document.createElement('div');
            messageDiv.className = 'success-message';
            messageDiv.textContent = 'Hướng dẫn đã được gửi đến email của bạn!';
            forgotPasswordForm.insertBefore(messageDiv, forgotPasswordForm.firstChild);
            setTimeout(() => { messageDiv.remove(); }, 3000);
        });
    }
    
    const regPassword = document.getElementById('reg-password');
    const regConfirmPassword = document.getElementById('reg-confirm-password');
    if (regConfirmPassword && regPassword) {
        regConfirmPassword.addEventListener('input', function() {
            if (regPassword.value !== regConfirmPassword.value) {
                regConfirmPassword.setCustomValidity('Mật khẩu xác nhận không khớp');
            } else {
                regConfirmPassword.setCustomValidity('');
            }
        });
    }
    
    const particles = document.querySelectorAll('.particle');
    if (particles.length > 0) {
        document.addEventListener('mousemove', function(e) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.05;
                const moveX = (e.clientX - centerX) * speed;
                const moveY = (e.clientY - centerY) * speed;
                particle.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
            });
        });
    }
});