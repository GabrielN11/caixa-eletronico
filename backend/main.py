from flask import Flask, request
from flask_restx import Api, Resource
import bcrypt


##Ainda tentando descobrir como importa os modulos e rotas dos outros arquivos de uma forma que funcione -_-
from src.server.instance import server
from src.lib.mysql import mysql
from datetime import date
from datetime import datetime

app, api = server.app, server.api

@api.route('/client')
class ClientRoute(Resource):

    def get(self):
        client = Client()
        id = request.args.get('id')
        if id == None or id == '':
            return 'Parâmetro não foi passado!', 403
        try:
            data = client.selectClient(id)
            return data, 200
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

        dictClient = {
            'id': user[0],
            'cpf': user[1],
            'name': user[2],
            'surname': user[3]
        }
        return dictClient

##

@api.route('/account')
class AccountRoute(Resource):

    def get(self):
        account = Account()
        client = Client()
        id = request.args.get('id')
        if id == None or id == '':
            return 'Parâmetro não foi passado!', 403
        
        try:
            account_data = account.selectAccount(id)
            client_data = client.selectClient(account_data['client_id'])
            account_data['client'] = client_data

            return account_data, 200
        except Exception as err:
            return err, 500

    def post(self):
        account = Account()
        data = api.payload
        
        password = data['password']
        balance = float(data['balance']) or 0
        client = data['client']
        number = data['number']

        if len(password) == 0 or client == None:
            return 'Campos não foram preenchidos corretamente', 403

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        try:
            account.insertAccount(hashed, client, balance, number)
            return 'Conta bancária criada!', 200
        except Exception as err:
            return str(err), 500


@api.route('/enter')
class LoginRoute(Resource):

    def post(self):
        account = Account()
        client = Client()
        data = api.payload

        number = data['number']
        password = data['password']

        try:
            sql = f"""
                SELECT senha FROM conta_bancaria WHERE numero = '{number}';
            """

            with mysql as bd:
                cursor = bd.conn.cursor()
                cursor.execute(sql)
                hashedPassword = cursor.fetchone()[0].encode('utf-8')
                bd.conn.commit()

            if bcrypt.checkpw(password.encode('utf-8'), hashedPassword):
                account_data = account.selectAccountByNumber(number)
                client_data = client.selectClient(account_data['client_id'])
                account_data['client'] = client_data
                account.updateLastAccess(number)
                return account_data, 200
            else:
                return 'Autenticação inválida!', 403
        except Exception as err:
            return str(err), 500






class Account:
    def selectAccount(self, id):
        sql = f"""
                SELECT id, cliente_id, saldo, ultimo_acesso, numero FROM conta_bancaria WHERE id = {id};
            """

        with mysql as db:
            cursor = db.conn.cursor()
            cursor.execute(sql)
            account = cursor.fetchone()
            db.conn.commit()
        dictAccount = {
            'id': account[0],
            'client_id': account[1],
            'balance': account[2],
            'last_access': account[3],
            'number': account[4]
        }
        return dictAccount

    def selectAccountByNumber(self, number):
        sql = f"""
                SELECT id, cliente_id, saldo, ultimo_acesso, numero FROM conta_bancaria WHERE numero = '{number}';
            """
        with mysql as db:
            cursor = db.conn.cursor()
            cursor.execute(sql)
            account = cursor.fetchone()
            db.conn.commit()
        dictAccount = {
            'id': account[0],
            'client_id': account[1],
            'balance': account[2],
            'last_access': account[3],
            'number': account[4]
        }
        return dictAccount

    def insertAccount(self, password, client, balance, number):
        password = str(password)
        strPassword = password.replace(password[0], "", 1).replace("'", "")
        print(strPassword)
        sql = f"""
                INSERT INTO conta_bancaria (senha, saldo, numero, cliente_id) VALUES
                ('{strPassword}', {balance}, {number}, {client});
            """

        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            bd.conn.commit()

    def updateLastAccess(self, number):
        dt = datetime.combine(date.today(), datetime.min.time())
        sql = f"""
            UPDATE conta_bancaria SET ultimo_acesso = '{dt}' WHERE numero = '{number}';
        """
        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            bd.conn.commit()
            


server.run()