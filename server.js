const express = require('express');
const cors = require('cors');

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

app.use(cors());
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

app.get('/produk/:id_produk',(req, res) => {
    const { id_produk } = req.params;
    const sql = 'SELECT * FROM produk WHERE id_produk = ?';
    db.query(sql, [id_produk], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});
 
//=====POST PRODUK=====//
app.post('/produk', (req, res) => {
    const { judul, deskripsi, harga, id_kategori} = req.body;

    if (! judul || !harga) {
        return res.status(400).json({ message: 'Judul dan harga wajib diisi'});
    }

    if (!deskripsi) {
        return res.status(400).json({ message: 'deskripsi wajib diisi'});
    }

    const sql = 'INSERT INTO produk (judul, deskripsi, harga, id_kategori, tgl_input) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [judul, deskripsi, harga, id_kategori], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({
            message: 'Produk berhasil ditambahkan',
            id_produk: results.insertId
        });
    });
});

//=====PUT PRODUK=====//
app.put('/produk/:id_produk', (req, res) => {
    const { id_produk } = req.params;
    const { judul, deskripsi, harga, id_kategori } = req.body;

    const sql = 'UPDATE produk SET judul=?, deskripsi=?, harga=?, id_kategori=? WHERE id_produk=?';
    db.query(sql, [judul, deskripsi, harga, id_kategori, id_produk], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.json({ message: 'Produk berhasil diupdate' });
    });
});

//=====DELETE PRODUK=====//
app.delete('/produk/:id_produk', (req, res) => {
    const { id_produk } = req.params;
    const sql = 'DELETE FROM produk WHERE id_produk=?';
    db.query(sql, [id_produk], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage});
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan'});
        }
        res.json({ message: 'Produk berhasil dihapus' });
    });
}) ;


//======GET KATEGORI=====//
app.get('/kategori', (req, res) => {
    const sql = 'SELECT * FROM kategori';
    db.query(sql, (err, results) => {
        if(err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.get('/kategori/:id_kategori', (req, res)  => {
    const { id_kategori } = req.params;

    const sql = 'SELECT * FROM kategori WHERE id_kategori = ?';

    db.query(sql, [id_kategori], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.sqlMessage
            });
        }
        
        res.json(results);
    });
});

//======PUT KATEGORI======//
app.put('/kategori/:id_kategori', (req, res) => {
    const { id_kategori } = req.params;
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
        return res.status(400).json({
            message:'Nama kategori wajib diisi'
        });
    }

    const sql = `UPDATE kategori SET nama_kategori=?, WHERE id_kategori=?`;
    db.query(sql [nama_kategori, id_kategori], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.sqlMessage
            });
        }

        res.json({
            message: 'Kategori berhasil diperbarui'
        });
    });
});

//======POST KATEGORI======//
app.post('/kategori', (req, res) => {
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
        return res.status(400).json({
            message: 'Nama kategori wajib diisi'
        });
    }

    const sql = 'INSERT INTO kategori (kategori) VALUES (?)';

    db.query(sql, [nama_kategori], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.sqlMessage
            });
        }

        res.status(201).json({
            message: 'Kategori berhasil ditambahkan yeyy...!!',
            id_kategori: results.insertID
        });
    });
});

//======DELETE KATEGORI=======//
app.delete('/kategori/:id_kategori', (req, res) => {
    const { id_kategori } = req.params;
    const sql = 'DELETE FROM produk WHERE id_kategori=?';
    db.query(sql, [id_kategori], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({ message: 'Kategori berhasil dihapus!!' });
    });
}) ;


//---------------------//

app.listen(PORT, () => {
    console.log(`Server Glowlist berjalan di http://localhost:${PORT}`);
});