const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/visitantes', async (req, res) => {
    const { cpf, celular, endereco, data_visita, visitado, autorizador } = req.body;
    try {
        await db.query(
            'INSERT INTO visitantes (cpf, celular, endereco, data_visita, visitado, autorizador) VALUES (?, ?, ?, ?, ?, ?)',
            [cpf, celular, endereco, data_visita, visitado, autorizador]
        );
        res.status(201).send({ message: 'Visitante cadastrado com sucesso!' });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/visitantes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM visitantes');
        res.json(rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
