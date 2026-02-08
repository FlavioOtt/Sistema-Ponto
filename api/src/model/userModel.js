const { query } = require("./mysqlConnect");
const fs = require('fs');
const path = require('path');

async function createJpegFileNode(base64String, filePath = 'image.jpeg') {

    const dirName = await filePath.substring(0, filePath.indexOf('-') -1).replaceAll("/", "-");  // Nome da pasta do dia atual, ex: 06-02-2026
    filePath = filePath.replaceAll("/", "-").replaceAll(":", "."); // Substitui caracteres especiais
    let dir = `images/${dirName}`;  // Diretório onde a imagem será salva, ex: images/06-02-2026

    // Verifica se o diretório existe, se não, cria-o
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');

    const buffer = Buffer.from(base64Data, 'base64');

    fs.writeFileSync(path.join(`${dir}/${filePath}`), buffer, (err) => {
        if (err) 
            console.error('Error writing file:', err);
        else 
            console.log(`File saved successfully to ${filePath}`);
        
    });
    return `${dir}/${filePath}`;
}

const register = async (body) => {

    let formatName = `${body.data_hora}_${body.ip}`;
    let image = await createJpegFileNode(body.base64, `${formatName}.jpeg`);

    let sql = `INSERT INTO ponto (
            data_hora, 
            path, 
            latitude, 
            longitude, 
            ip
        ) VALUES (
            "${body.data_hora}", 
            "${image}", 
            "${body.latitude}",
            "${body.longitude}",
            "${body.ip}"
        )
    `;

    let res = await query(sql);
    let result = { message: "Erro ao registrar ponto", status: false };

    if (!image)
        return result.error = "Erro ao salvar imagem";

    if (res)
        if (res.affectedRows > 0)
            result = { message: "Ponto registrado com sucesso", status: true }        

    return result;
}

module.exports = { register }
