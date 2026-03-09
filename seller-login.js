let isSignupMode = false;

function toggleMode() {
    isSignupMode = !isSignupMode;

    const formTitle = document.getElementById("formTitle");
    const nameField = document.getElementById("nameField");
    const submitBtn = document.getElementById("submitBtn");
    const toggleText = document.getElementById("toggleText");
    const msg = document.getElementById("msg");

    msg.innerText = "";

    if (isSignupMode) {
        formTitle.innerText = "Seller Signup";
        nameField.style.display = "block";
        submitBtn.innerText = "Sign Up";
        submitBtn.onclick = sellerSignup;
        toggleText.innerHTML = 'Already have an account? <a onclick="toggleMode()">Login</a>';
    } else {
        formTitle.innerText = "Seller Login";
        nameField.style.display = "none";
        submitBtn.innerText = "Login";
        submitBtn.onclick = sellerLogin;
        toggleText.innerHTML = 'Don\'t have an account? <a onclick="toggleMode()">Sign up</a>';
    }
}

async function sellerLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("msg").innerText = "Please fill all fields";
        return;
    }

    const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        document.getElementById("msg").innerText = data.message;
        return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "seller.html";
}

async function sellerSignup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        document.getElementById("msg").innerText = "Please fill all fields";
        return;
    }

    const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        document.getElementById("msg").innerText = data.message;
        return;
    }

    const msgEl = document.getElementById("msg");
    msgEl.innerText = data.message + " - Logging you in...";
    msgEl.className = "success";

    setTimeout(() => {
        sellerLogin();
    }, 1000);
}
