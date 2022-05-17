from flask_restx import Resource
from datetime import datetime

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.account import Account
from src.controllers.atm import ATM
from src.lib.authorization import clientAuthorization


app, api = server.app, server.api

@api.route('/withdraw')
class WithdrawRoute(Resource):

    @clientAuthorization
    def post(self):
        account = Account()
        withdraw = Withdraw()
        atm = ATM()

        id = api.payload['id']
        value = float(api.payload['value'])

        if not account.validateValue(value):
            return 'Informe um valor válido.', 403
        elif not account.validateId(id):
            return 'Ocorreu um erro no saque. Tente novamente', 403

        try:
            notes = atm.defineNotesByValue(value)
            result = withdraw.withdraw(id, value)
            if result == True:
                atm.withdrawNotes(notes)
                updatedAccount = account.selectAccount(id)
                return {
                    "notes": notes,
                    "account": updatedAccount
                }, 200
            else:
                return result, 403
        except Exception as err:
            return str(err), 500

        

        


class Withdraw:
    def withdraw(self, id, value):
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
            elif currentBalance[0] < value:
                return 'Saldo insuficiente.'
                
            currentBalance = float(currentBalance[0])

            sqlUpdate = f"""
                UPDATE conta_bancaria SET saldo = {(currentBalance - value)} WHERE id = {id};
            """

            cursor.execute(sqlUpdate)

            sqlInsert = f"""
                INSERT INTO transacao (valor, conta_bancaria_id, tipo, data)
                    VALUES ({value}, {id}, 'Saque', '{dt}');
            """

            cursor.execute(sqlInsert)

            bd.conn.commit()
            
        return True