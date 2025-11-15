# TODOLIST RESTFULL-API

Todolist RESTFULL API pada project ini menggunakan beberapa teknologi yang sudah terkenal : bahasa pemrograman JavaScript dengan Runtime Enviroment Node.JS. dan DBMS MySQL

### Tools :

- JavaScript : Bahasa pemrograman yang digunakan untuk project ini dengan Ecma Script Module Sintaks
- Node.JS : Runtime Enviroment untuk menjalankan JavaScript di sisi server
- NPM : module pengelolaan paket dan dependensi yang digunakan pada project
- MySQL : database management system, software untuk menyimpan dan mengelola data
- Prettier : merapikan kode agar mudah dibaca dan terstruktur
- Eslint : mengkoreksi kesalahan penulisan kode dan sintaks error dan reaktor dasar

### Dependensi :

- express.js : mini framework untuk membuat dan merutekan endpoint server RESTFULL-API yang dibuat
- validator : menyediakan utilitas untuk validasi
- bcryptjs : untuk melakukan hash terhadap sebuah string agar tidak disimpan secara mentah, digunakan untuk keamanan password
- dotenv : memuat variabel lingkungan yang rahasia dan tidak disebar luaskan
- mysql2 : sebagai driver mysql, menjembatani koneksi ke mysql
- winston : logging, memberikan informasi saat menjalankan ataupun men-develop

### Struktur Direktori Project

+-- root/ </br>
|-.git/ </br>
|-configs/ </br>
| |-config.mjs </br>
| |-database.connection.config.mjs </br>
| |-looger.confif.mjs </br>
|-errors/ </br>
|-repositories </br>
|-services/ </br>
|-controllers/ </br>
|-utils/ </br>
|-routes/ </br>
|-middlewares/ </br>
|- </br>
