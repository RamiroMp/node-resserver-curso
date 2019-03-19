///////////////////////////////
// Puerto
//////////////////////////////


process.env.PORT = process.env.PORT || 3000;



/////////////////////////////////
// Entorno
/////////////////////////////////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/////////////////////////////////
// Vencimiento del Token
/////////////////////////////////
//60 segundos
//60 minutos
//24 horas
// 30 dias   
process.env.CADUCIDAD_TOKEN = 30 * 24 * 60 * 60;

/////////////////////////////////
// Seed
/////////////////////////////////
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/////////////////////////////////
//Base de Datos
/////////////////////////////////

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
    //urlDB = 'mongodb+srv://cafe-user:telemac11@cluster-jenmb.mongodb.net/cafe?retryWrites=true'
}

process.env.URLDB = urlDB;

/////////////////////////////////
//Google Client ID
/////////////////////////////////

process.env.CLIENT_ID = process.env.CLIENT_ID || '1058440777313-49bmhmflsvdn8cmh5benhp9vuuu0dlkf.apps.googleusercontent.com'