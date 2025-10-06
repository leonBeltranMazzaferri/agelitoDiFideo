import express from 'express'

import pool from './config/conexion.js'
const app = express()
const PORT = 3000

app.use(express.json())
// middleware para interpretar los json que viene por request body en post y put

//pag inicio
app.get('/', async (req, res) => {
    res.send('API REST ful con MySQL')
})

//Obtener todos los usuarios
app.get('/users', async (req, res) => {
    const sql = "SELECT * FROM users";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql);
        connection.release(); //libera conexion   
        res.json(rows)
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Obtener un usuario identificado por un  ID
app.get('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)
    const sql = "SELECT * FROM users WHERE ID_user = ?";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);
        //hay que pasale el sql y el dato que reemplaza el signo ?

        (rows[0]) ? res.json(rows[0]) : res.send('El usuario no existe')
        //rows devuelve un array que contiene un objeto, con [0] tomo solo el objeto  
        connection.release();
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Escribir un nuevo usuario
app.post('/users', async (req, res) => {
    const values = req.body
    // console.log(values)

    // const sql = "INSERT INTO users (Name, Email, Image, Pass, Type_user) VALUES (?,?,?,?,?)";
    const sql = 'INSERT INTO users SET ?'; //equivalente a lo de arriba
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [values]); 
        //hay que pasale el sql y el dato que reemplaza el signo ?

        connection.release();

        console.log(rows)
         //rows devuelve muchos datos entre ellos el id creado que lo uso para el send, insertId
        res.status(201).send(`Usuario Creado con id ${rows.insertId}`)
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Modificar datos de un usuario identificado por un  ID
app.put('/users/:id', async (req, res) => {
    const id = req.params.id
    const values = req.body
    // console.log(values)

    const sql = 'UPDATE users SET ? WHERE ID_user = ?';
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [values, id]); 
        connection.release();
        // console.log(rows)
        // console.info(rows.affectedRows)
        if (rows.affectedRows == 0) { return res.send('Usuario no existe') }
        res.send('Usuario actualizado')
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Eliminar un usuario
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM users WHERE ID_user = ?";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);  //hay que pasale el sql y el dato que reemplaza el signo ?
        connection.release();
        // console.log(rows)
        // //affectedRoews muestra la cant de registros actualizados si es igual a cero no modifico ningun registro
        (rows.affectedRows == 0) ? res.send('Usuario no existe') : res.status(204).send()
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Paginas inexistentes - errores de url
app.use((req, res) => {
    res.status(404).send('Pagina inexistente')
})

app.listen(PORT, () => console.log(`Servidor Corriendo http://localhost:${PORT}`))