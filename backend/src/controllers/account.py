from flask import request
from flask_restx import Resource
import bcrypt
from datetime import datetime

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.client import Client


app, api = server.app, server.api

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
            return str(err), 500

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


@api.route('/transfer')
class TransferRoute(Resource):

    def post(self):
        account = Account()
        data = api.payload

        receiver = data['receiver']
        sender = data['sender']
        value = float(data['value'])

        try:
            result = account.transfer(sender, receiver, value)
            if(result):
                return f'Transferência de R${value:.2f} efetuada com sucesso!', 200
            else:
                return 'O saldo atual é menor do que a quantia a ser transferida!', 403
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
        sql = f"""
                INSERT INTO conta_bancaria (senha, saldo, numero, cliente_id) VALUES
                ('{strPassword}', {balance}, {number}, {client});
            """

        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            bd.conn.commit()

    def updateLastAccess(self, number):
        dt = datetime.now()
        sql = f"""
            UPDATE conta_bancaria SET ultimo_acesso = '{dt}' WHERE numero = '{number}';
        """
        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            bd.conn.commit()

    def transfer(self, sender, receiver, value):
        dt = datetime.now()
        sqlSelect1 = f"""
            SELECT saldo FROM conta_bancaria WHERE id = {sender};
        """

        sqlSelect2 = f"""
            SELECT saldo, id from conta_bancaria WHERE numero = '{receiver}';
        """

        with mysql as bd:
            cursor = bd.conn.cursor()

            cursor.execute(sqlSelect1)
            senderBalance = float(cursor.fetchone()[0])
            bd.conn.commit()

            cursor.execute(sqlSelect2)
            receiverInfo = cursor.fetchone()
            receiverBalance = receiverInfo[0]
            receiverId = receiverInfo[1]
            bd.conn.commit()


        if(senderBalance - value > 0):
            updateSql1 = f"""
                UPDATE conta_bancaria SET saldo = {senderBalance - value} WHERE id = {sender};
            """

            updateSql2 = f"""
                UPDATE conta_bancaria SET saldo = {receiverBalance + value} WHERE numero = '{receiver}';
            """

            insertSql1 = f"""
                INSERT INTO transacao (valor, conta_bancaria_id, tipo, data) VALUES
                ({-value}, {sender}, 'Transferência', '{dt}');
            """
            insertSql2 = f"""
                INSERT INTO transacao (valor, conta_bancaria_id, tipo, data) VALUES
                ({value}, {receiverId}, 'Transferência', '{dt}');
            """


            with mysql as bd:
                cursor = bd.conn.cursor()
                
                cursor.execute(updateSql1)
                bd.conn.commit()

                cursor.execute(updateSql2)
                bd.conn.commit()

                cursor.execute(insertSql1)
                bd.conn.commit()

                cursor.execute(insertSql2)
                bd.conn.commit()

            return True
        else:
            return False