import Ponto from "./Ponto.js";

let ponto = null;

$(document).ready(() => {

    // Se nao for dispositivo móvel, avisa o usuário em localizacao
    if (!isMobileDevice()) {
        $("#isNotMobile").show();
    }

    $(".startsHide").hide(); // Esconde secoes e divs desnecessarias no inicio

});

// Navegar entre seções
function showSection(sectionId) {
    $(".section").hide(); // Remove todas as secoes
    $(`#${sectionId}`).toggle(); // Mostra a secao desejada
}

// Atualiza hora e data e saudação dinamicamente
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const timeString = now.toLocaleTimeString('pt-BR');
    const day = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
    
    let greeting;
    if (hour < 12) greeting = "Bom dia!";
    else if (hour < 18) greeting = "Boa tarde!";
    else greeting = "Boa noite!";

    $("#greeting").text(greeting);
    $("#date").text(day);    
    $("#time").text(timeString);
    
}
updateGreeting();
setInterval(updateGreeting, 1000); // Atualiza a cada segundo

//  Cria registro de ponto
function createPonto(data_hora){
    ponto = new Ponto(data_hora);
}

// Retorna se o usuario está em um dispositivo móvel
const isMobileDevice = () => {
    // String User Agent
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Verifica se o tamanho da tela se é pequena (menos de 768px de largura)
    if (!isMobile && window.screen.width < 768) {
        isMobile = true;
    }

    return isMobile;
};

// Adiciona um registro de ponto
const addRegistry = async function() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');
    const dayString = now.toLocaleDateString('pt-BR');

    const registryEntry = `<li>Registro em ${dayString} às ${timeString}</li>`;
    $("#registryList").append(registryEntry);
    $("#registryListContainer").show();
    $("#wait").hide();

    fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data_hora: ponto.data_hora,
            base64: document.getElementById('canvas').toDataURL('image/jpeg'),
            ip: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip),
            latitude: ponto.latitude,
            longitude: ponto.longitude
        })
    })
    .then(response => response.json())
    .then(data => console.log("Registro adicionado:", data))
    .catch(error => console.error("Erro ao adicionar registro:", error));
}

// Capturar foto do usuário
const capturePhoto = function() {
    $("#video").hide();
    $("#canvas").toggle();
    ctx.drawImage(video, 0, 0);
}

// Atulizar mapa com a localizacao do usuário
const refreshMap = async function () {
    if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(showPosition); // Solicita a localização do usuário e chama a função showPosition para atualizar o mapa
    } else {
        alert("Geolocation nao é suportado por este navegador."); // Aviso em caso de erro ou falta de suporte
    }
}

// Callback atualizar mapa com a localizacao do usuário
async function showPosition(position) {
    // Extract latitude and longitude from the position object
    const latitude = await position.coords.latitude;
    const longitude = await position.coords.longitude;

    ponto.latitude = latitude;
    ponto.longitude = longitude;

    $("#map").attr("src", `https://www.google.com/maps/embed/v1/view?key=AIzaSyDC5LhWdCNMAzH-Nix9RFTwC5AfRyx8ZLc&center=${latitude},${longitude}&zoom=15`);
}

// Câmera
let stream;
const ctx = document.getElementById('canvas').getContext('2d');

// Inicia a câmera
const startCamera = async function() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById('video').srcObject = stream;
        
    } catch (err) {
        alert("Erro ao acessar câmera: " + err.message);
    }
}

export {
    addRegistry,
    startCamera,
    capturePhoto,
    refreshMap,
    createPonto,
    showSection
}

