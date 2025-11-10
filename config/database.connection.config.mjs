import mysql from 'mysql2/promise';
import CONFIG from './config.mjs';
import LOGGER from './logger.config.mjs';

let pool = mysql.createPool({
    host: CONFIG.DB_HOST,
    port: CONFIG.DB_PORT,
    user: CONFIG.DB_USERNAME,
    password: CONFIG.DB_PASSWORD,
    database: CONFIG.DB_DATABASE_NAME,

    waitForConnections: true,
    connectionLimit: 10
});
try {
    LOGGER.info({ message: 'mencoba membuat pooling ke database...', label: 'db' });



    let testQueryResult = null;
    {
        LOGGER.info({ message: 'mencoba test query...' });

        testQueryResult = await pool.query('SHOW DATABASES;'); // langsung query atau execute yang aman
        console.log({ testQueryResult });
    }
    {
        const connection = await pool.getConnection();

        testQueryResult = await connection.query(`SHOW TABLES`);

        console.log({ testQueryResult });

        connection.release(); // release connection yang dibuat individudal, cocok buat transaksi 

    }
} catch (error) {
    LOGGER.error({ message: 'terjadi error pada saat membuat koneksi pooling ke db !' });
    console.error(error);
    process.exit(1);
} finally {
    LOGGER.info('percobaann nterhubung ke db selesai!');
};

function endPool() {
    pool.end();
    LOGGER.info('koneksi pool ke database diakhiri dan selesai!');
}


export { pool };




// Fungsi untuk melakukan pembersihan (cleanup)
const gracefulShutdown = (event) => {
    LOGGER.info({ label: "db", message: 'Proses menerima ${ event }. Melakukan pembersihan...`' });
    // Lakukan operasi pembersihan sinkron/asinkron di sini
    // Contoh:
    // 1. Menutup koneksi database
    endPool();
    // 2. Menutup koneksi server HTTP agar tidak menerima request baru
    // 3. Menutup koneksi WebSocket/RabbitMQ
    // 4. Menyelesaikan permintaan yang sedang berlangsung

    // Pastikan operasi asinkron selesai sebelum memanggil process.exit() secara eksplisit
    // atau biarkan proses keluar secara alami jika tidak ada pekerjaan yang tersisa.

    // Untuk SIGINT dan SIGTERM, setelah pembersihan asinkron selesai, 
    // Anda dapat memanggil process.exit() dengan kode yang sesuai.
    if (event === 'SIGINT' || event === 'SIGTERM') {
        LOGGER.info({ label: 'db', message: 'Pembersihan selesai. Keluar sekarang.' });
        process.exit(0); // Keluar dengan kode sukses
    }
};

// Menangani sinyal terminasi (Ctrl+C, manajer proses, dll)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

// Menangani kesalahan tak tertangani
process.on('uncaughtException', (err) => {
    LOGGER.error({ label: 'db', message: 'Kesalahan tak tertangani:' , err});
    console.error(err)
    gracefulShutdown('uncaughtException');
    // Setelah uncaughtException, sebaiknya keluar dengan kode error
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    LOGGER.error({ label: 'db', message: 'Penolakan promise tak tertangani pada:', promise, reason });
    gracefulShutdown('unhandledRejection');
    process.exit(1);
});

// Event 'exit' (hanya bisa menjalankan kode sinkron)
process.on('exit', (code) => {
    LOGGER.info({ label: 'db', message: '`Proses keluar dengan kode: ${ code }`' });
    // Tidak bisa melakukan operasi asinkron di sini
});

// Event 'beforeExit' (bisa menjalankan kode asinkron untuk menunda keluar)
process.on('beforeExit', (code) => {
    LOGGER.info({ message: 'Event beforeExit dengan kode: ', code });
    // Jika ada pekerjaan asinkron yang perlu dilakukan, lakukan di sini
});

