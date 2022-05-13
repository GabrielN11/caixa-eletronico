from flask import Flask, request
from flask_restx import Api, Resource

from server.instance import server
from lib.mysql import mysql

app, api = server.app, server.api

@api.route('/client')
class ClientRoute(Resource):

    def __init__(self):
        self.client = Client()

    def get(self):
        id = request.args.get('id')
        if id == None or id == '':
            return 'Parâmetro não foi passado!', 403
        try:
            client = self.client.selectClient(id)
            return client
        except Exception as err:
            return err, 500
        
    def post(self):
        data = api.payload

        name = data['name']
        surname = data['surname']
        cpf = data['cpf']

        if not self.client.validateName(name):
            return 'Nome é muito longo', 403
        elif not self.client.validateSurname(surname):
            return 'Sobrenome é muito longo', 403
        elif not self.client.validateCpf(cpf):
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
                return err, 500

    def put(self):
        id = request.args.get('id')
        if id == None or id == '':
            return 'Parâmetro não foi passado!', 403

        data = api.payload

        name = data['name']
        surname = data['surname']
        cpf = data['cpf']

        if not self.client.validateName(name):
            return 'Nome é muito longo', 403
        elif not self.client.validateSurname(surname):
            return 'Sobrenome é muito longo', 403
        elif not self.client.validateCpf(cpf):
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
            return err, 500

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
            return err, 500

class Client:
    def validateName(self, name):
        return not len(name) > 45

    def validateCpf(self, cpf):
        return not len(cpf) != 11

    def validateSurname(self, surname):
        return not len(surname) > 100

    def selectClient(self, id):
        sql = f"""
            SELECT * FROM cliente WHERE id = {id}; 
        """
        with mysql as db:
            cursor = db.conn.cursor()

            cursor.execute(sql)
            user = cursor.fetchone()
            db.conn.commit()
        return user