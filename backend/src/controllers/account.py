from flask import request
from flask_restx import Resource
import bcrypt
import cryptography
from datetime import datetime

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.client import Client
from src.controllers.transactions import Transaction
from src.lib.authorization import adminAuthorization


app, api = server.app, server.api

@api.route('/account')
class AccountRoute(Resource):

    @adminAuthorization
    def get(self):
        account = Account()
        client = Client()
        id = request.args.get('account_id')
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
        balance = 0
        client = data['client']
        number = data['number']

        if len(password) < 4:
            return 'Senha não foi preenchida corretamente', 403
        if client == None:
            return 'Cliente não foi informado!', 403
        if len(number) != 6:
            return 'Número da conta precisa ter 6 digitos!', 403

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        try:
            account.insertAccount(hashed, client, balance, number)
            return 'Conta bancária criada!', 200
        except Exception as err:
            return str(err), 500

    @adminAuthorization
    def put(self):
        account = Account()
        data = api.payload
        id = data['id']
        password = data['password']
        client = data['client']
        number = data['number']

        if len(password) < 4:
            return 'Senha não foi preenchida corretamente', 403
        if client == None:
            return 'Cliente não foi informado!', 403
        if len(number) != 6:
            return 'Número da conta precisa ter 6 digitos!', 403

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        try:
            account.updateAccount(id, hashed, client, number)
            return 'Conta bancária atualizada!', 200
        except Exception as err:
            return str(err), 500

    @adminAuthorization
    def delete(self):
        account = Account()
        transaction = Transaction()
        id = request.args.get('account_id')
        try:
            info = account.selectAccount(id)
            if info['balance'] > 0:
                return 'Não é possível excluir uma conta com saldo positivo!', 403
            transaction.deleteTransactions(id)
            account.deleteAccount(id)
            return 'Conta bancária deletada!', 200
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

    def updateAccount(self, id, password, client, number):
        password = str(password)
        strPassword = password.replace(password[0], "", 1).replace("'", "")
        sql = f"""
                UPDATE conta_bancaria SET
                senha = '{strPassword}',
                numero = {number},
                cliente_id = {client} 
                WHERE id = {id};
            """

        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            bd.conn.commit()

    def deleteAccount(self, id):
        sql = f"""
                DELETE FROM conta_bancaria WHERE id = {id};
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
                SELECT conta.id, conta.cliente_id, conta.saldo, conta.ultimo_acesso, conta.numero, cliente.nome,
                cliente.sobrenome, cliente.cpf FROM 
                conta_bancaria as conta INNER JOIN cliente as cliente ON conta.cliente_id = cliente.id;
            """
        
        with mysql as db:
            cursor = db.conn.cursor()
            cursor.execute(sql)
            accountList = cursor.fetchall()
            db.conn.commit()

        def formatList(account):
            if(account[3] == None):
                formattedDate = 'Nunca entrou.'
            else:
                newdate = account[3].split('.', 1)[0]
                date = newdate.split(' ', 1)[0]
                time = newdate.split(' ', 1)[1]
                dateInfo = date.split('-')
                date = f'{dateInfo[2]}/{dateInfo[1]}/{dateInfo[0]}'

                formattedDate = f'{date} às {time}'

            accountDict = {
            'client_id': account[1],
            'balance': account[2],
            'number': account[4],
            'id': account[0],
            'last_access': formattedDate,
            'client': {
                'id': account[1],
                'name': account[5],
                'last_name': account[6],
                'cpf': account[7]
                }
            }
            return accountDict

        dictList = list(map(formatList, accountList))

        return dictList

    def validatePassword(self, password):
        return len(password) >= 4
    
    def validateNumber(self, number):
        return number != None or number != ''
    
    def validateValue(self, value):
        return value >= 0

    def validateId(self, id):
        return id != None