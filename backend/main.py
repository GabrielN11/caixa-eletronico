from flask import Flask, request
from flask_restx import Api, Resource

from src.server.instance import server
from src.lib.mysql import mysql
from flask import request

app, api = server.app, server.api

@api.route('/client')
class ClientRoute(Resource):
    def get(self):
        id = request.args.get('id')
        if id == None or id == '':
            return 'Parâmetro não foi passado!', 403
        sql = f"""
            SELECT * FROM cliente WHERE id = {id}; 
        """
        try:
            with mysql as db:
                cursor = db.conn.cursor()

                cursor.execute(sql)
                user = cursor.fetchall()
                db.conn.commit()
            return user[0], 200
        except Exception as err:
            return err, 500
        
    def post(self):
        data = api.payload

        name = data['name']
        surname = data['surname']
        cpf = data['cpf']

        if not self.validateName(name):
            return 'Nome é muito longo', 403
        elif not self.validateSurname(surname):
            return 'Sobrenome é muito longo', 403
        elif not self.validateCpf(cpf):
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

        if not self.validateName(name):
            return 'Nome é muito longo', 403
        elif not self.validateSurname(surname):
            return 'Sobrenome é muito longo', 403
        elif not self.validateCpf(cpf):
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

    def validateName(self, name):
        return not len(name) > 45

    def validateCpf(self, cpf):
        return not len(cpf) != 11

    def validateSurname(self, surname):
        return not len(surname) > 100

server.run()