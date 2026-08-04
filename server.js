const express = require('express');
const app = express();
const mysql2 = require('mysql2');
const PORT =3001;

const db = mysql2.createConnection({
    host : 'Localhost',
    user : 'root',
    password : '',
    database : 'glowlist_db'
});

db.connect(err => {
    if(err) {
        console.error('Koneksi ke database gagal:', err);
        }else {
        console.log('Berhasil konek ke database Glowlist');
        }
});


app.use(express.json());

app.get('/', (req, res)=> {
    res.send('Selamat Datang Di Glowlist API!!');
});


//=======GET PRODUK======//
app.get('/produk', (req, res) => {
    const sql = 'SELECT * FROM produk';
    db.query(sql, (err, results) => {
        if(err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

//======GET KATEGORI=====//
app.get('/kategori', (req, res) => {
    const sql = 'SELECT * FROM kategori';
    db.query(sql, (err, results) => {
        if(err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

//---------------------//

app.listen(PORT, () => {
    console.log(`Server Glowlist berjalan di http://localhost:${PORT}`);
});