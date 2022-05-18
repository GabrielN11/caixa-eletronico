import { IAccount } from "../interfaces";
import Client from "./Client";

export default class Account implements IAccount{

    id?: number;
    client_id: number;
    balance: number;
    last_access?: string | undefined;
    number: string;
    token: string;
    client: Client;

    constructor(client_id: number, balance: number, number: string, token: string, client: Client, id?: number,
         last_access?: string){

            this.client_id = client_id;
            this.balance = balance;
            this.last_access = last_access;
            this.number = number;
            this.token = token;
            this.client = client;
            if(id){
                this.id = id;
            }
            if(last_access){
                this.last_access = last_access;
            }
        }
}