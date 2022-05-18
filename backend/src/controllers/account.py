from flask import request
from flask_restx import Resource
import bcrypt
import cryptography
from datetime import datetime

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.client import Client
from src.lib.authorization import adminAuthorization


app, api = server.app, server.api

@api.route('/account')
class AccountRoute(Resource):

    @adminAuthorization
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
            return str(err), 500

    @adminAuthorization
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

@api.route('/account-list')
class AccountListRoute(Resource):
    
    @adminAuthorization
    def get(self):
        account = Account()
        try:
            accounts = account.selectAllAccounts()

            return accounts, 200
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

    def insertAccount(self, password, client, balance, number):
        password = str(password)
        strPassword = password.replace(password[0], "", 1).replace("'", "")
        sql = f"""
                INSERT INTO conta_bancaria (senha, saldo, numero, cliente_id) VALUES
                ('{strPassword}', {balance}, {number}, {client});
            """

        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            bd.conn.commit()

    def selectAccountsByClientId(id):
        sql = f"""
                SELECT id, cliente_id, saldo, ultimo_acesso, numero FROM conta_bancaria WHERE cliente_id = {id};
            """

        with mysql as db:
            cursor = db.conn.cursor()
            cursor.execute(sql)
            accountList = cursor.fetchall()
            db.conn.commit()

        dictList = list(map(lambda account: {
            'id': account[0],
            'client_id': account[1],
            'saldo': account[2],
            'ultimo_acesso': account[3],
            'numero': account[4]
        }, accountList))

        return dictList

    def selectAllAccounts(self):
        sql = """
                SELECT id, cliente_id, saldo, ultimo_acesso, numero FROM conta_bancaria;
            """
        with mysql as db:
            cursor = db.conn.cursor()
            cursor.execute(sql)
            accountList = cursor.fetchall()
            db.conn.commit()

        dictList = list(map(lambda account: {
            'id': account[0],
            'client_id': account[1],
            'saldo': account[2],
            'ultimo_acesso': account[3],
            'numero': account[4]
        }, accountList))

        return dictList

    def validatePassword(self, password):
        return len(password) >= 4
    
    def validateNumber(self, number):
        return number != None or number != ''
    
    def validateValue(self, value):
        return value >= 0

    def validateId(self, id):
        return id != None