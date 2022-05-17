from flask import request
from flask_restx import Resource

from src.lib.mysql import mysql
from src.server.instance import server

from src.lib.authorization import adminAuthorization

app, api = server.app, server.api

@api.route('/client')
class ClientRoute(Resource):

    @adminAuthorization
    def get(self):
        client = Client()
        id = request.args.get('id')
        if id == None or id == '':
            return 'Parâmetro não foi passado!', 403
        try:
            data = client.selectClient(id)
            return data, 200
        except Exception as err:
            return str(err), 500

    @adminAuthorization    
    def post(self):
        client = Client()
        data = api.payload

        name = data['name']
        surname = data['surname']
        cpf = data['cpf']

        if not client.validateName(name):
            return 'Nome é muito longo', 403
        elif not client.validateSurname(surname):
            return 'Sobrenome é muito longo', 403
        elif not client.validateCpf(cpf):
            return 'CPF inválido!', 403
        else:
            sql = f"""
                INSERT INTO cliente (nome, sobrenome, cpf) VALUES ('{name}', '{surname}', '{cpf}');
            """

            try:
                with mysql as db:
                    cursor = db.conn.cursor()

                    cursor.execute(sql)
                    db.conn.commit()

                return 'Cliente registrado com sucesso!', 200
            except Exception as err:
                return str(err), 500

    @adminAuthorization
    def put(self):
        client = Client()
        id = request.args.get('id')
        if id == None or id == '':
            return 'Parâmetro não foi passado!', 403

        data = api.payload

        name = data['name']
        surname = data['surname']
        cpf = data['cpf']

        if not client.validateName(name):
            return 'Nome é muito longo', 403
        elif not client.validateSurname(surname):
            return 'Sobrenome é muito longo', 403
        elif not client.validateCpf(cpf):
            return 'CPF inválido!', 403

        sql = f"""
            UPDATE cliente SET cpf = '{cpf}', nome = '{name}', sobrenome = '{surname}' WHERE id = {id};
        """

        try:
            with mysql as db:
                cursor = db.conn.cursor()
                cursor.execute(sql)
                db.conn.commit()
            return 'Dados do cliente alterados com sucesso!', 200
        except Exception as err:
            return str(err), 500

    @adminAuthorization
    def delete(self):
        id = request.args.get('id')

        sql = f"""
            DELETE FROM cliente WHERE id = {id}
        """

        try:
            with mysql as db:
                cursor = db.conn.cursor()
                cursor.execute(sql)
                db.conn.commit()

            return 'Conta do cliente foi encerrada.', 200
        except Exception as err:
            return str(err), 500

@api.route('/client-list')
class ClientListRoute(Resource):

    @adminAuthorization
    def get(self):
        client = Client()
        try:
            users = client.selectAllClients()

            return users, 200
        except Exception as err:
            return str(err), 500

class Client:
    def validateName(self, name):
        return not len(name) > 45

    def validateCpf(self, cpf):
        return not len(cpf) != 11

    def validateSurname(self, surname):
        return not len(surname) > 100

    def selectClient(self, id):
        sql = f"""
            SELECT id, cpf, nome, sobrenome FROM cliente WHERE id = {id}; 
        """
        with mysql as db:
            cursor = db.conn.cursor()

            cursor.execute(sql)
            user = cursor.fetchone()
            db.conn.commit()

        dictClient = {
            'id': user[0],
            'cpf': user[1],
            'name': user[2],
            'surname': user[3]
        }
        return dictClient
    
    def selectAllClients(self):
        sql = f"""
            SELECT id, cpf, nome, sobrenome FROM cliente;
        """

        with mysql as db:
            cursor = db.conn.cursor()
            cursor.execute(sql)
            userList = cursor.fetchall()
            db.conn.commit()

        dictList = list(map(lambda user: {
            'id': user[0],
            'cpf': user[1],
            'name': user[2],
            'surname': user[3]
        }, userList))

        return dictList