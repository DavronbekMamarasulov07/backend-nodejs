import fs from "fs"; 


export const log = (message) => {
    
    const time = new Date().toISOString();
    const text = time + " - " + message;
    
    fs.writeFileSync('logs.txt', text)
}

export const readLogs = () => {
    try {
        const data = fs.readFileSync("logs.txt", "utf-8");
        console.log(data)
    } catch (error) {
        console.log("Xatolik, qayta urinib ko'ring")
    }
}

