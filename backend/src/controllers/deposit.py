from ast import With
from flask_restx import Resource
from datetime import datetime

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.account import Account
from src.controllers.atm import ATM
from src.lib.authorization import clientAuthorization


app, api = server.app, server.api


@api.route('/deposit')
class DepositRoute(Resource):


    @clientAuthorization
    def post(self):
        account = Account()
        deposit = Deposit()
        
        id = api.payload['id']
        value = float(api.payload['value'])
        money = api.payload['money'][0]

        if not account.validateValue(value):
            return 'Informe um valor válido.', 403
        elif not account.validateId(id):
            return 'Ocorreu um erro no depósito. Tente novamente', 403
        try:
            result = deposit.deposit(id, value, money)
            if result == True:
                return f'O depósito de R${value:.2f} foi efetuado com sucesso.'
            else:
                return result, 403
        except Exception as err:
            return str(err), 500


class Deposit:

    def __init__(self):
        self.atm = ATM()

    def deposit(self, id, value, money):
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

        self.atm.depositNotes(money)

        return True