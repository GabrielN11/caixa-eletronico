import { IClient } from "../interfaces";

export default class Client implements IClient{

    id: number;
    cpf: string;
    name: string;
    surname: string;
    
    constructor(id: number, cpf: string, name: string, surname: string){
        this.id = id;
        this.cpf = cpf;
        this.name = name;
        this.surname = surname;
    }

    getFullName(){
        return this.name + ' ' + this.surname;
    }
}