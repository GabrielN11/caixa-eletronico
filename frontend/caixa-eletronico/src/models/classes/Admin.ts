import { IAdmin } from "../interfaces";

export default class Admin implements IAdmin{
    id: number;
    name: string;
    surname: string;
    username: string;
    token: string;
    
    constructor(id: number, name: string, surname: string, username: string, token: string){
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.token = token;
    }
}