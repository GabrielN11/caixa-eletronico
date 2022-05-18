import { IClient } from "../interfaces";

export default class Client implements IClient{

    id?: number;
    cpf: string;
    name: string;
    surname: string;
    
    constructor(cpf: string, name: string, surname: string, id?: number){
        this.cpf = cpf;
        this.name = name;
        this.surname = surname;
        if(id){
            this.id = id;
        }
    }

    getFullName(){
        return this.name + ' ' + this.surname;
    }
}