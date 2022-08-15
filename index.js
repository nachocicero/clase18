const express = require('express');
require('dotenv').config();
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 8080;


//algo de la clase vieja 
/* app.get('/',(req,res)=>{
    res.send('Hola mundo')
}); */

/* app.get('/home',(req,res)=>{

});
 */


//conexion a la base de datos  con mysql2 lo comento para no tener que conectar a la base de datos en el deploy

/* const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,   
    database: process.env.DATABASE
}); */

/* conexion.connect(function(err){
    if(err){
        console.error('error al conectar: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos: ' + conexion.threadId);
}   ); */

//en teoria funcioan mal 
/* conexion.connect((err) => {
    if(err) console.error('error al conectar: ' + err.stack);
    console.log(`Conectado a la base de datos ${process.env.DATABASE}`);
}   ); */

//esto aca va pero ahora lo saco para el deploy

/* conexion.connect((err) => {
    if(err) {
        console.error('error al conectar: ' + err.stack);
        return;
    }
    console.log(`Conectado a la base de datos ${process.env.DATABASE}`);
}   ); */


 //conexion.connect();

 //verbo http GET para obtener datos



//configuracion middleware

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


//configuracion de hbs motor de plantillas

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'views'));  //para que busque en la carpeta views   //__dirname es el directorio actual donde esta el archivo index.js
hbs.registerPartials(path.join(__dirname,'views/partials'));
    
//rutas
app.get('/',(req,res, next)=>{
    res.render('index',{
        title:'EL CAPO DE NACHO'
});
});

app.get('/formulario',(req,res, next)=>{
    res.render('formulario', {
        title:'Formulario',
        style:'formulario.css'
    });
});

 app.get('/productos',(req,res)=>{

                      //si hay error, se detiene la ejecucion y se muestra el error
            res.render('productos', {                      //si no hay error, se renderiza la pagina productos con los datos de la base de datos
                title:'Productos',
                //results: result, //se muestra el resultado de la consulta  
            });
        });


/*  app.get('/productos',(req,res, next)=>{

     let sql = 'SELECT * FROM productos';

    conexion.query(sql,(err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
         if(err) throw err;                       //si hay error, se detiene la ejecucion y se muestra el error
            res.render('productos', {                      //si no hay error, se renderiza la pagina productos con los datos de la base de datos
                //results: result, //se muestra el resultado de la consulta  
            });
        });
}); */

app.post('/formulario',(req,res)=>{

    //let nombre = req.body.nombre;
    //let precio = req.body.precio;

    const {nombre, precio} = req.body;	//destructuracion de objetos

    console.log(nombre, precio);

    if (nombre == '' || precio == '') {
       let validacion = 'Rellene todos los campos';
//falta el titulo
         res.render('formulario', { validacion
    });
    } else {

        let datos = {
            nombre: nombre,
            precio: precio
        }

        let sql = 'INSERT INTO productos SET ?';

        conexion.query(sql, datos, (err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
            if(err) throw err;                        //si hay error, se detiene la ejecucion y se muestra el error
            res.render('formulario', {                      //si no hay error, se muestra el resultado de la consulta
                title:'Formulario',                       //se muestra el resultado de la consulta
                validacion: 'Producto añadido correctamente' //se muestra el resultado de la consulta  
            });
        }   );


    //res.send(`Tus datos recibidos son : Nombre: ${nombre} y precio: ${precio}`);
 //   res.render('formulario',{
     //   title:'Formulario' })
}

});

app.get('/contacto',(req,res)=>{
    res.render('contacto',{
        title:'Contacto'
    });
}   );

app.post('/contacto',(req,res)=>{
    const {nombre, email} = req.body;
    let fecha = new Date().getDate();
   
    if (nombre == '' || email == '') {
        let validacion = 'Rellene todos los campos correctamente';
 //falta el titulo
          res.render('contacto', { validacion}
     );
     } else {
        console.log(nombre, email);

    async function envioEmail() { 

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASSWORD_EMAIL
            }
        });

        let envio = await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: `${email}`,
            subject: 'Gracias por contactarnos',
            html: `<h1>Gracias ${nombre} por contactarnos </h1> <br> 
            <p>Te responderemos a la brevedad</p> <br> ${fecha}   `
    });
        //res.send(`Tus datos recibidos son : Nombre: ${nombre} y email: ${email}`);

    res.render( 'enviado', {
        title:'Mail Enviado',
        nombre,
        email
    })
    }
    envioEmail();

    let datos = {                           //CONEXION A LA BASE DE DATOS
        nombre: nombre,
        email: email
    }

    let sql = 'INSERT INTO contactos SET ?';

    conexion.query(sql, datos, (err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
        if(err) throw err;                        //si hay error, se detiene la ejecucion y se muestra el error
        /* res.render('contacto', {                      //si no hay error, se muestra el resultado de la consulta
            title:'Contacto',                       //se muestra el resultado de la consulta
            validacion: 'Datos guardados' //se muestra el resultado de la consulta  
        }); */
    }   );

       }
   });


  




    
     

  /*  let datos = {                           //CONEXION A LA BASE DE DATOS
             nombre: nombre,
             email: email
         }
 
         let sql = 'INSERT INTO contactos SET ?';
 
         conexion.query(sql, datos, (err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
             if(err) throw err;                        //si hay error, se detiene la ejecucion y se muestra el error
             res.render('contacto', {                      //si no hay error, se muestra el resultado de la consulta
                 title:'Contacto',                       //se muestra el resultado de la consulta
                 validacion: 'Datos guardados' //se muestra el resultado de la consulta  
             });
         }   );

            }
        }) */

      /*   ------------------------------------------------------- */
    /* const {nombre, email, mensaje} = req.body;
    console.log(nombre, email, mensaje);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD */
        
    

    /* let mailOptions = {
        from: process.env.USER,
        to: process.env.USER,
        subject: 'Nuevo mensaje de contacto',
        text: `Nombre: ${nombre} \n Email: ${email} \n Mensaje: ${mensaje}`
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) throw err;
        console.log('Email enviado: ' + info.response);
    }   );
    res.render('contacto',{
        title:'Contacto',
        validacion: 'Mensaje enviado correctamente'
    }); */



app.listen(PORT,()=>{
    //console.log(`Servidor corriendo en el puerto ${PORT}`);
}   );