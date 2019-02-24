///////////////////////////////
// Puerto
//////////////////////////////


process.env.PORT = process.env.PORT || 3000;



/////////////////////////////////
// Entorno
/////////////////////////////////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';




/////////////////////////////////
//Base de Datos
/////////////////////////////////

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://cafe-user:telemac11@cluster-jenmb.mongodb.net/test?retryWrites=true'
}

process.env.URLDB = urlDB;