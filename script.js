// --- GÜVENLİK AYARLARI ---

// BURAYA ŞİFRENİN KENDİSİNİ DEĞİL, SHA-256 HASH KODUNU YAZACAKSIN
// Örnek: "2016" şifresinin hash'i aşağıdadır. Sen kendi şifreninkini buraya koy.
const DOGRU_HASH = "8cde9f7a3ce619f10553959f61ccfcfe52318602e09ae5e8c9357051981d2783"; 

const loginScreen = document.getElementById("login-screen");
const lobbyScreen = document.getElementById("lobby-screen");
const passInput = document.getElementById("password-input");
const btnLogin = document.getElementById("btn-login");
const errorMsg = document.getElementById("error-msg");

// --- ŞİFRELEME FONKSİYONU (SHA-256) ---
// Bu fonksiyon girilen metni karmaşık bir koda çevirir
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// --- GİRİŞ KONTROLÜ ---
async function girisYap() {
    const girilen = passInput.value;
    
    // Girilen şifreyi hash'le ve saklanan hash ile karşılaştır
    const girilenHash = await sha256(girilen);

    if (girilenHash === DOGRU_HASH) {
        // Şifre Doğru
        loginScreen.style.opacity = "0";
        setTimeout(() => {
            loginScreen.style.display = "none";
            lobbyScreen.classList.remove("hidden");
        }, 500);
    } else {
        // Şifre Yanlış
        errorMsg.textContent = "Yanlış anahtar! 🛑";
        passInput.classList.add("shake");
        setTimeout(() => {
            passInput.classList.remove("shake");
            errorMsg.textContent = "";
        }, 500);
        passInput.value = "";
    }
}

// Butona tıkla
btnLogin.addEventListener("click", girisYap);

// Enter'a basınca
passInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") girisYap();
});

// Shake Animasyonu (CSS yoksa buradan ekler)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
.shake { animation: shake 0.3s; }
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
}
`;
document.head.appendChild(styleSheet);