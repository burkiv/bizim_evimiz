// --- GÜVENLİK AYARLARI ---
// Senin Hash Kodun (Burayı kendi kodunla değiştirmeyi unutma!)
const DOGRU_HASH = "8cde9f7a3ce619f10553959f61ccfcfe52318602e09ae5e8c9357051981d2783"; 

const loginScreen = document.getElementById("login-screen");
const lobbyScreen = document.getElementById("lobby-screen");
const passInput = document.getElementById("password-input");
const btnLogin = document.getElementById("btn-login");
const errorMsg = document.getElementById("error-msg");

// --- 1. SAYFA YÜKLENİNCE KONTROL ET ---
// Tarayıcı hafızasına bak: Daha önce giriş yapılmış mı?
document.addEventListener("DOMContentLoaded", () => {
    const girisIzni = localStorage.getItem("samiye_giris_yapti");
    
    if (girisIzni === "evet") {
        // Zaten giriş yapılmış, direkt lobiyi aç (Animasyonsuz)
        loginScreen.style.display = "none";
        lobbyScreen.classList.remove("hidden");
    }
});

// --- ŞİFRELEME FONKSİYONU ---
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// --- GİRİŞ İŞLEMİ ---
async function girisYap() {
    const girilen = passInput.value.trim(); // Boşlukları temizle
    const girilenHash = await sha256(girilen);

    if (girilenHash === DOGRU_HASH) {
        // Şifre Doğru!
        
        // *** KRİTİK NOKTA: Hafızaya Kaydet ***
        localStorage.setItem("samiye_giris_yapti", "evet");

        // Animasyonla aç
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

// Butonlar
btnLogin.addEventListener("click", girisYap);
passInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") girisYap();
});

// Shake Animasyonu
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