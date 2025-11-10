import { ConfigError } from '../errors/config.error.mjs';
import isNullish from '../utils/isNullish.mjs';

import dotenv from 'dotenv';


const _CONFIG= {};
const CONFIG = new Proxy(_CONFIG, {
 get(target, propKey){
  const value = Reflect.get(target, propKey);
  if(isNullish(target)){
   const config = {
    
   };
   config[propKey] = value;
   throw new ConfigError(`prop value is null or undefined`, config);
  }
  return value;
 },
 
 set(target, propKey, value){
  if(isNullish(value)){
   const config = {
    
   };
   config[propKey]=value;
   throw new ConfigError('value cannot be null or undefined', config);
  }
  return Reflect.set(target, propKey, value);
 }
})



dotenv.config({path: './.env'});

console.log(process.env)
// APP 
CONFIG.APP_PORT = process.env.APP_PORT || 3000;

// LOGGER 
CONFIG.LOGGER_LEVEL = process.env.LOGGER_LEVEL;



// DB 
CONFIG.DB_HOST = process.env.DB_HOST;
CONFIG.DB_PORT = Number(process.env.DB_PORT)
CONFIG.DB_USERNAME = process.env.DB_USERNAME;
CONFIG.DB_PASSWORD = process.env.DB_PASSWORD;
CONFIG.DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;


export default Object.freeze(CONFIG);