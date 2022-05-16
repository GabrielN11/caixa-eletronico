import Client from "./classes/client"

export interface IAccount{
    id: number,
    client_id: number,
    balance: number,
    last_access?: string | undefined,
    number: string,
    token: string,
    client: Client
}

export interface IClient{
    id: number,
    cpf: string,
    name: string,
    surname: string
}

export interface IWarning{
    active: boolean,
    text: string,
    mode: string,
    timer: number
}