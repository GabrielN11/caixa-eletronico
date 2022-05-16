import { IAccount } from "../interfaces";
import Client from "./Client";

export default class Account implements IAccount{

    id: number;
    client_id: number;
    balance: number;
    last_access?: string | undefined;
    number: string;
    token: string;
    client: Client;

    constructor(id: number, client_id: number, balance: number, last_access: string | undefined,
        number: string, token: string, client: Client){

            this.id = id;
            this.client_id = client_id;
            this.balance = balance;
            this.last_access = last_access;
            this.number = number;
            this.token = token;
            this.client = client;
        }
}