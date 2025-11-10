export class ConfigError extends Error{
 constructor(message = 'configuration error', config = {}){
  super(message);
  this.config = config;
 }
}