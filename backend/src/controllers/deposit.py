from ast import With
from flask_restx import Resource
from datetime import datetime

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.account import Account


app, api = server.app, server.api

@api.route('/deposit/<id>')
class DepositRoute(Resource):
    def post(self, id):
        account = Account()
        deposit = Deposit()

        value = float(api.payload['value'])

        if not account.validateValue(value):
            return 'Informe um valor válido.', 403

        try:
            result = deposit.deposit(id, value)
            if result == True:
                return f'O depósito de R${value:.2f} foi efetuado com sucesso.'
            else:
                return result, 403
        except Exception as err:
            return str(err), 500


class Deposit:
    def deposit(self, id, value):
        sqlSelect = f"""
            SELECT saldo FROM conta_bancaria WHERE id = {id};
        """
        dt = datetime.now()

        with mysql as bd:
            cursor = bd.conn.cursor()

            cursor.execute(sqlSelect)
            currentBalance = cursor.fetchone()
            if currentBalance == None:
                return 'Conta bancaria não encontrada. Tente novamente.'
            
            currentBalance = float(currentBalance[0])

            sqlUpdate = f"""
                UPDATE conta_bancaria SET saldo = {(currentBalance + value)} WHERE id = {id};
            """

            cursor.execute(sqlUpdate)

            sqlInsert = f"""
                INSERT INTO transacao (valor, conta_bancaria_id, tipo, data)
                    VALUES ({value}, {id}, 'Depósito', '{dt}');
            """

            cursor.execute(sqlInsert)

            bd.conn.commit()

        return True