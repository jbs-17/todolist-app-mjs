

# RESTful API Todolist (Node.js & MySQL)

Proyek ini adalah implementasi **RESTful API** lengkap untuk manajemen tugas sederhana (*Simple Todolist*). Dibangun di atas **Node.js** dan **Express.js** menggunakan **ES Modules (.mjs)**, dengan fokus pada arsitektur berlapis (Controller $\rightarrow$ Service $\rightarrow$ Repository) untuk memastikan kode bersih dan aman.

> **Dokumentasi ini dibuat oleh Gemini, AI Assistant dari Google, dengan beberapa penyesuaian dan edit oleh pemilik project.**

-----

## 🏗️ 1. Arsitektur Proyek dan Implementasi

### A. Struktur Folder Inti

Struktur proyek didukung oleh arsitektur berlapis (Clean Layered Architecture):

```plaintext
root/
├── configs/          # Konfigurasi Database, Logger, dan App.
├── controllers/      # Layer HTTP: Menangani Request & Response.
├── errors/           # Custom Error Classes (e.g., ValidationError 400, DataNotExistsError 404).
├── middlewares/      # Express Middlewares (Auth, Validasi Body, Error Handler).
├── mysql/            # File SQL untuk pembuatan tabel.
├── repositories/     # Layer Data: Kueri SQL, terbagi per modul (users/ dan todolist_simple/).
├── routes/           # Definisi rute API.
├── services/         # Layer Bisnis: Logika utama, Otorisasi, Hashing.
└── utils/            # Fungsi bantuan (Hashing, Token, Validasi, dll.).
```

### B. Alur Permintaan dan Otorisasi

  * **Autentikasi**: Middleware `user.middlewares.verifyToken` menyuntikkan data pengguna (`req.user: { id, email, username }`) ke dalam *request* setelah memverifikasi **Bearer Token** JWT.
  * **Otorisasi**: Di **Service Layer** (misalnya, `todolist_simple.services.mjs`), setiap operasi CRUD pada tugas secara eksplisit memverifikasi `user_id` dari `req.user` dengan `id` tugas yang ditargetkan.

-----

## 🛠️ 2. Teknologi & Dependensi

Proyek ini dikembangkan menggunakan **ES Modules (.mjs)**.

| Kategori | Teknologi/Tool | Versi | Tujuan |
| :--- | :--- | :--- | :--- |
| **Runtime** | **Node.js** | LTS | Lingkungan eksekusi server. |
| **Web Framework** | **Express.js** | `~5.1.0` | Routing dan manajemen HTTP. |
| **Database Client**| **`mysql2`** | `~3.15.3` | Klien MySQL dengan dukungan **Promise** dan **Prepared Statements**. |
| **Keamanan** | **`bcryptjs`** | `~3.0.3` | Hashing kata sandi. |
| **Autentikasi**| **`jsonwebtoken`**| `~9.0.2` | Implementasi *stateless authentication*. |
| **Validasi** | **`validator`** | `~13.15.23` | Pengecekan format input. |
| **Logging** | **`winston`** | `~3.18.3` | Log aplikasi terstruktur. |
| **Linter/Formatter**| **`eslint`, `prettier`**| `~9.39.1` | Kualitas dan konsistensi kode. |

-----

## 🔑 3. Fitur Keamanan dan Validasi

| Fitur | Implementasi di Kode | Deskripsi |
| :--- | :--- | :--- |
| **Validasi Password**| `utils/isValidPassword.mjs` | Memastikan *password* **minimal 8 karakter** dan mengandung setidaknya **satu huruf besar, satu angka, dan satu simbol** (sebagaimana terlihat di `isValidPassword.mjs`). |
| **Email Unik** | `users/insert.one.mjs` & `user.services.mjs` | Mencegah pendaftaran jika email sudah ada (Mengembalikan `DataAlreadyExistsError` 409). |
| **Otorisasi Data** | `todolist_simple.services.mjs` | Fungsi seperti `findById` dan `updateDone` memerlukan `user_id` dan `id` tugas, memastikan hanya pemilik yang bisa memodifikasi. |
| **Error Handling** | `middlewares/error.handler.mjs` | Mencegah *stack trace* bocor ke *client* dan memberikan respons JSON error yang konsisten. |

-----

## 📖 4. Dokumentasi API Endpoint

Semua rute menggunakan *prefix* utama `/api/v1`.

### A. 👤 Modul User (Prefix: `/api/v1/user`)

| Metode | Endpoint | Autentikasi | Deskripsi | Status Code Sukses |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Mendaftarkan pengguna baru (email, password). Username dibuat otomatis (`utils/randomUsername.mjs`). | 201 Created |
| `POST` | `/login` | Public | Otentikasi dan penerbitan JWT. | 200 OK |
| `GET` | `/get-data` | **Bearer Token** | Mengambil detail profil pengguna yang sedang *login* (`req.user`). | 200 OK |
| `PATCH` | `/email` | **Bearer Token** | Memperbarui alamat email (Memerlukan verifikasi password). | 204 No Content |
| `PATCH` | `/password` | **Bearer Token** | Memperbarui kata sandi (Memerlukan password lama dan baru). | 204 No Content |
| `DELETE` | `/delete` | **Bearer Token** | Menghapus akun pengguna (Memerlukan verifikasi password). | 204 No Content |

### B. ✅ Modul TodoList (Prefix: `/api/v1/todolist_simple`)

> **Semua Endpoint di Modul ini memerlukan Autentikasi (Bearer Token).**

| Metode | Endpoint | Deskripsi | Keterangan Request |
| :--- | :--- | :--- | :--- |
| `POST` | `/create-one` | Membuat tugas baru. | **Body:** `title` (Wajib), `description`, `start_time`, `end_time` |
| `GET` | `/all` | Mengambil **seluruh** daftar tugas milik pengguna. | N/A (Menggunakan `req.user.id`) |
| `GET` | `/:id` | Mengambil detail **satu** tugas. | **URL Params:** `:id` |
| `PUT` | `/update-full` | Memperbarui *semua field* tugas. | **Body:** `id` (Wajib), `title` (Wajib), ... |
| `PATCH` | `/done` | Mengubah status tugas (`is_done`). | **Body:** `id` (Wajib) |
| `DELETE` | `/delete-one` | Menghapus satu tugas. | **Body:** `id` (Wajib) |
| `DELETE` | `/delete-many` | Menghapus banyak tugas sekaligus. | **Body:** `ids` (Array of numbers, Wajib) |

-----

## 7\. Skema Database (MySQL)

### Tabel `users`

*Digunakan untuk menyimpan kredensial dan identitas pengguna.*

```sql
CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  
  CONSTRAINT uq_users_email UNIQUE KEY (email),
  CONSTRAINT uq_users_username UNIQUE KEY (username)
);
```

### Tabel `todolist_simple`

*Digunakan untuk menyimpan data tugas, terikat pada `users.id`.*

```sql
CREATE TABLE todolist_simple (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,

    is_done BOOL DEFAULT 0,
    
    start_time DATETIME DEFAULT NULL,
    end_time DATETIME DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_user_status (user_id, is_done),

    CONSTRAINT fk_todolist_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);
```