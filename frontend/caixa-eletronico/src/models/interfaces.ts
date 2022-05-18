import Client from "./classes/Client"

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
    id?: number,
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

export interface ITransaction{
    value: number,
    type: string,
    date: string
}

export interface INote{
    value: number,
    image: string,
    name: string,
    quantity: number
}

export interface IAdmin{
    id: number,
    name: string,
    surname: string,
    username: string,
    token: string
}