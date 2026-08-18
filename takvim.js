const haftaGunleri = [
    "Pzt",
    "Sal",
    "Çar",
    "Per",
    "Cum",
    "Cmt",
    "Paz"
];

function takvimHucreOlustur(gun, ay, yil) {
    const hucre = document.createElement("td");
    hucre.className = "day";

    if (gun === 0) {
        return hucre;
    }

    const tarih = new Date(yil, ay - 1, gun);
    const bugun = new Date();
    const gunAlani = document.createElement("span");
    gunAlani.textContent = gun;
    hucre.appendChild(gunAlani);

    if (
        tarih.getFullYear() === bugun.getFullYear() &&
        tarih.getMonth() === bugun.getMonth() &&
        tarih.getDate() === bugun.getDate()
    ) {
        hucre.classList.add("today");
    }

    return hucre;
}

function takvimiOlustur(takvim, ay) {
    const takvimBaslik = document.querySelector("#takvim-baslik");
    const takvimAyi = document.querySelector("#takvim-ayi");
    const takvimGunleri = document.querySelector("#takvim-gunleri");

    if (!takvimAyi || !takvimGunleri) {
        return;
    }

    takvimBaslik.textContent = `${takvim.yil} Takvimi`;
    takvimAyi.textContent = `${ay.ad} ${takvim.yil}`;
    takvimGunleri.replaceChildren();

    const gunListeleri = haftaGunleri.map((_, index) => {
        const veriAnahtari = [
            "pazartesi",
            "Salı",
            "Çarşamba",
            "Perşembe",
            "Cuma",
            "Cumartesi",
            "Pazar"
        ][index];

        return ay[veriAnahtari] || [];
    });
    const toplamGun = ay.toplam_gun || Math.max(...gunListeleri.flat());
    const ilkGun = new Date(takvim.yil, ay.Ayn_no - 1, 1).getDay();
    const pazartesiBaslangici = (ilkGun + 6) % 7;
    const haftaSayisi = Math.ceil((pazartesiBaslangici + toplamGun) / 7);
    let gun = 1;

    for (let hafta = 0; hafta < haftaSayisi; hafta += 1) {
        const satir = document.createElement("tr");

        for (let gunIndex = 0; gunIndex < 7; gunIndex += 1) {
            const hucreSirasi = hafta * 7 + gunIndex;
            const gunNumarasi =
                hucreSirasi >= pazartesiBaslangici && gun <= toplamGun ? gun++ : 0;
            satir.appendChild(takvimHucreOlustur(gunNumarasi, ay.Ayn_no, takvim.yil));
        }

        takvimGunleri.appendChild(satir);
    }
}

async function takvimVerisiniAl() {
    try {
        const response = await fetch("takvim.json");

        if (!response.ok) {
            throw new Error(`Takvim verisi alınamadı: ${response.status}`);
        }

        const takvim = await response.json();
        const mevcutAy = new Date().getFullYear() === takvim.yil
            ? new Date().getMonth() + 1
            : 1;
        const ay = takvim.aylar.find((takvimAyi) => takvimAyi.Ayn_no === mevcutAy) || takvim.aylar[0];

        takvimiOlustur(takvim, ay);
    } catch (error) {
        const takvimAyi = document.querySelector("#takvim-ayi");

        if (takvimAyi) {
            takvimAyi.textContent = "Takvim yüklenemedi";
        }

        console.error(error);
    }
}

takvimVerisiniAl();