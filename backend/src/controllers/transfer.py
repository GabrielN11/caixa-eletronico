from flask_restx import Resource
from datetime import datetime

from src.server.instance import server
from src.lib.mysql import mysql
from src.controllers.account import Account


app, api = server.app, server.api

@api.route('/transfer')
class TransferRoute(Resource):

    def post(self):
        account = Account()
        transfer = Transfer()
        data = api.payload

        receiver = data['receiver']
        sender = data['sender']
        value = float(data['value'])

        if not account.validateNumber(receiver):
            return 'Remetente inválido', 403
        elif not account.validateId(sender):
            return 'Ocorreu um erro na transferência. Tente novamente.', 403,
        elif not account.validateValue(value):
            return 'Não é possível transferir valores negativos.', 403

        try:
            result = transfer.transfer(sender, receiver, value)
            if result == True:
                return f'Transferência de R${value:.2f} efetuada com sucesso!', 200
            else:
                return result, 403
        except Exception as err:
            return str(err), 500

class Transfer:
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
            senderBalance = cursor.fetchone()
            if senderBalance == None:
                return 'Ocorreu um erro na transferência. Tente novamente.'
            senderBalance = float(senderBalance[0])

            cursor.execute(sqlSelect2)
            receiverInfo = cursor.fetchone()
            if receiverInfo == None:
                return 'Número do destinatário não encontrado.'

            receiverBalance = receiverInfo[0]
            receiverId = receiverInfo[1]


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
                cursor = bd.conn.cursor()
                
                cursor.execute(updateSql1)

                cursor.execute(updateSql2)

                cursor.execute(insertSql1)

                cursor.execute(insertSql2)

                bd.conn.commit()

                return True
            else:
                return 'O valor a ser transferido é superior ao saldo da conta.'