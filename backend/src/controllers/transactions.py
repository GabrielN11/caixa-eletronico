from flask import request
from flask_restx import Resource

from src.server.instance import server
from src.lib.mysql import mysql
from src.lib.authorization import clientAuthorization


app, api = server.app, server.api

@api.route('/transaction/<id>')
class TransactionRoute(Resource):

    @clientAuthorization
    def get(self, id):
        transaction = Transaction()

        if id == None or id == '':
            return 'Falha na operação. Tente novamente', 403
        
        try:
            result = transaction.selectTransactions(id)

            return result, 200
        except Exception as err:
            return str(err), 500
        

class Transaction:
    def selectTransactions(self, id):
        sql = f"""
            SELECT valor, tipo, data FROM transacao WHERE conta_bancaria_id = {id};
        """

        with mysql as bd:
            cursor = bd.conn.cursor()

            cursor.execute(sql)
            transactionList = cursor.fetchall()
            bd.conn.commit()

        def formatList(transaction):
            newdate = transaction[2].split('.', 1)[0]
            date = newdate.split(' ', 1)[0]
            time = newdate.split(' ', 1)[1]
            dateInfo = date.split('-')
            date = f'{dateInfo[2]}/{dateInfo[1]}/{dateInfo[0]}'

            formattedDate = f'{date} às {time}'

            transactionDict = {
                "value": transaction[0],
                "type": transaction[1],
                "date": formattedDate
            }

            return transactionDict

        transactionDictList = list(map(formatList, transactionList))

        return transactionDictList

    def deleteTransactions(self, id):
        sql = f"""
            DELETE FROM transacao WHERE conta_bancaria_id = {id};
        """

        with mysql as bd:
            cursor = bd.conn.cursor()

            cursor.execute(sql)
            bd.conn.commit()

        