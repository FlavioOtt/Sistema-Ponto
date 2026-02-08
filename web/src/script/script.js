import {
    addRegistry,
    startCamera,
    capturePhoto,
    refreshMap,
    createPonto,
    showSection
} from "./utils.js";

// JQuery
$(document).ready(() => {
    
    // Ao registrar ponto, navega para a seção de localização
    $("#register").click(() => { 
        refreshMap();
        let data = new Date();
        createPonto(`${data.toLocaleDateString("pt-BR")} - ${data.toLocaleTimeString("pt-BR")}`)
        showSection('location') 
    })

    // Ao confirmar localização, navega para a seção de selfie
    $("#confirmLocation").click(() => {
        showSection('photo');
        startCamera();
    })
    
    // Ao capturar foto, adiciona registro e volta para a seção de boas-vindas
    $("#capturePhoto").click(() => {
        capturePhoto();
        addRegistry();
        showSection("welcome");
    })

});
