import express from 'express'
// import pool from '../../config/conexion.js'
const app = express()
const PORT = 3000

app.use(express.json())
// middleware para interpretar los json que viene por request body en post y put

import usersRoutes from './src/routes/users.routes.js'
app.use(usersRoutes)

//pag inicio
app.get('/', async (req, res) => {
    res.send('API REST ful con MySQL')
})

//Paginas inexistentes - errores de url
app.use((req, res) => {
    res.status(404).send('Pagina inexistente')
})

app.listen(PORT, () => console.log(`Servidor Corriendo http://localhost:${PORT}`))