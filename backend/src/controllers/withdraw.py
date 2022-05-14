from ast import With
from flask_restx import Resource
from datetime import datetime

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.account import Account


app, api = server.app, server.api

@api.route('/withdraw/<id>')
class WithdrawRoute(Resource):
    def post(self, id):
        account = Account()
        withdraw = Withdraw()
        value = float(api.payload['value'])

        if not account.validateValue(value):
            return 'Informe um valor válido.', 403

        try:
            result = withdraw.withdraw(id, value)

            if result == True:
                return f'Saque de R${value:.2f} efetuado com sucesso. Aguarde a contagem das notas.', 200
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