const app = express();
app.get('/', function(req, res) {
    respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'hola mundo'
    };
    res.send(respuesta);
});