from flask_restx import Resource
from datetime import datetime
import bcrypt
import cryptography

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.account import Account
from src.controllers.client import Client


app, api = server.app, server.api

@api.route('/enter')
class LoginRoute(Resource):

    def post(self):
        account = Account()
        login = Login()
        client = Client()
        data = api.payload

        number = data['number']
        password = data['password']

        if not account.validateNumber(number):
            return 'Número de conta inválido.', 403
        elif not account.validatePassword(password):
            return 'Senha inválida', 403

        try:
            sql = f"""
                SELECT senha FROM conta_bancaria WHERE numero = '{number}';
            """
            with mysql as bd:
                cursor = bd.conn.cursor()
                cursor.execute(sql)
                hashedPassword = cursor.fetchone()
                if hashedPassword == None:
                    bd.conn.commit()
                    return 'Conta não encontrada.', 403
                bd.conn.commit()

            hashedPassword = hashedPassword[0].encode('utf-8')

            if bcrypt.checkpw(password.encode('utf-8'), hashedPassword):
                account_data = login.selectAccountByNumber(number)
                client_data = client.selectClient(account_data['client_id'])
                account_data['client'] = client_data
                account.updateLastAccess(number)
                return account_data, 200
            else:
                return 'Autenticação inválida!', 403
        except Exception as err:
            return str(err), 500

class Login:
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