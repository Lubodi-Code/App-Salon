import {db } from '../config/db.js';
import dotenv from 'dotenv';
import Services from '../models/Services.js';
import { services } from './beautyServices.js';
import colors from 'colors';
dotenv.config();
await db();



async function seedDB(){
   try {
    await Services.insertMany(services);
    console.log( colors.green.bold('Base de datos inicializada correctamente'));
    process.exit(0);
   } catch (error) {
    console.log(error );
    process.exit(1);
   }

}
function cleearDB(){
    try{
        Services.deleteMany({});
        console.log(colors.red.bold('Base de datos eliminada correctamente'));
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if(process.argv[2] === '--import'){
    seedDB();
}
else {
    cleearDB();
    
}
