// import { log, readLogs } from "./logger.js";

// log("App started");

// setTimeout(() => {
//     log("First timeout event")
// }, 2000)

// let count = 0

// const interval = setInterval(() => {
//     count++;
//     log("Interval tick");

//     if (count == 3) {
//         clearInterval(interval)
//     }
// }, 3000)

// setTimeout(() => {
//   const logs = readLogs();
//   if (logs) {
//     console.log("Loglar yuklanmoqda...");
//     console.log(logs);
//     console.log("yakunlandi");
//   }
// }, 5000);

import http from "http";

const users = [
  {
    id: 10,
    ism: "Ali",
    yosh: 12,
  },
  {
    id: 20,
    ism: "Vali",
    yosh: 13,
  },
];

// userlar ro'yhatidagi ohirgi userning id ni aniqlab +1 qo'shib qaytaradi.
let nextId = users.length ? users[users.length - 1].id + 1 : 1;
let totalReq = 0;

let lastRequestTime = "";

const server = http.createServer((req, res) => {
  // user yuborayotgan endpoint masalan /users.
  const path = req.url;

  // serverga yuborilayotgan method: POST,PUT,GET,DELETE
  const method = req.method;

  // serverga yuborilgan so'rovlar sonini hisob boradi.
  totalReq++;
  // serverga yuborilgan ohirgi so'rovni saqlab boradi.
  lastRequestTime = new Date().toLocaleString();

  // umumiy userlar haqida ma'lumot olish so'rovi
  if (method === "GET" && path == "/users") {
    // userga userlar haqida ma'lumotni su'niy kechiktirib yuborish.
    setTimeout(() => {
      res.statusCode = 200;
      res.end(JSON.stringify(users));
    }, 500);
  }

  //necha marta serverga so'rov yuborilganligi haqida bilish so'rovi
  else if (method === "GET" && path == "/totalreq") {
    res.statusCode = 200;
    res.end(JSON.stringify(totalReq));
  }
  
  //umumiy statistikani qaytadigan so'rov 
  else if (method === "GET" && path == "/stats") {
    res.statusCode = 200;

    // umumiy ma'lumotlarni yuborish
    let stats = {
      // umumiy serverga yuborilgan so'rovlar
      TotalRequest: totalReq,
      // umumiy userlar  so'
      UsersCount: users.length,
      // ohirgi serverga yuborilgan so'rov vaqti
      LastRequestTime: lastRequestTime,
    };
    res.end(JSON.stringify(stats));
  }
  
  // yangi user yaratish uchun so'rov
  else if (method === "POST" && path == "/users") {
    let body = "";

    // user yaratayotgan yangi ma'lumotlarni qo'shib borish.
    req.on("data", (chunk) => (body += chunk));

    req.on("end", () => {
      try {
        const user = JSON.parse(body);

        // ism va yosh kiritilishini majburiy qilib kursatadi
        if (!user.ism || !user.yosh) {
          res.statusCode = 400;
          return res.end(
            JSON.stringify({ error: "ism va yosh kiritish majburiy" })
          );
        }

        // user allaqachon mavjud bulsa xatolik qaytaradi
        if (users.find((u) => u.ism === user.ism)) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: "User allaqachon mavjud" }));
        }
        // yangi qo'shilayotgan userga id berish
        user.id = nextId++;
        //yangi qo'shilgan userni userlar ro'yhatiga qo'shish.
        users.push(user);

        res.statusCode = 201;
        res.end(JSON.stringify(user));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  }
  
  // agarda yangi user yaratilayotgan vaqtda noto'g'ri manzilgan so'rov yuborilganda 
  else if (method === "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
  }
  
  
  else if (method === "PUT" && path == "/users") {
    res.statusCode = 200;
    res.end("Bu put zaprosi edi");
  }
  
  else if (method === "DELETE" && path == "/users") {
    res.statusCode = 200;
    res.end("Bu delete zaprosi edi");
  }
  
  else {
    res.statusCode = 404;
    res.end("Page is not found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
