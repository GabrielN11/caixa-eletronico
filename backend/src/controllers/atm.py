from flask_restx import Resource

from src.server.instance import server
from src.lib.mysql import mysql
from src.lib.authorization import clientAuthorization
from variables import atmId


app, api = server.app, server.api

@api.route('/atm')
class ATMRoute(Resource):

    @clientAuthorization
    def get(self):
        atm = ATM()
        try:
            notes = atm.selectNotes()
            return notes, 200
        except Exception as err:
            return str(err), 500
        

class ATM:

    def selectNotes(self):
        sql = f"""
            SELECT valor_total, notas_2, notas_5, notas_10, notas_20, notas_50, notas_100, notas_200
            FROM caixa_eletronico WHERE id = {atmId};
        """

        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            notes = cursor.fetchone()
            bd.conn.commit()

        dictNotes = {
            "total": notes[0],
            "note_2": notes[1],
            "note_5": notes[2],
            "note_10": notes[3],
            "note_20": notes[4],
            "note_50": notes[5],
            "note_100": notes[6],
            "note_200": notes[7]
        }

        return dictNotes

    def defineNotesByValue(self, value):
        notes = self.selectNotes()
        withdraw_notes = {
            "total_value": value,
            "note_2": 0,
            "note_5": 0,
            "note_10": 0,
            "note_20": 0,
            "note_50": 0,
            "note_100": 0,
            "note_200": 0
        }

        while notes['note_200'] > 0 and value >= 200:
            value -= 200
            notes['note_200'] -= 1
            withdraw_notes['note_200'] += 1
        
        while notes['note_100'] > 0 and value >= 100:
            value -= 100
            notes['note_100'] -= 1
            withdraw_notes['note_100'] += 1
        
        while notes['note_50'] > 0 and value >= 50:
            value -= 50
            notes['note_50'] -= 1
            withdraw_notes['note_50'] += 1
        
        while notes['note_20'] > 0 and value >= 20:
            value -= 20
            notes['note_20'] -= 1
            withdraw_notes['note_20'] += 1 

        while notes['note_10'] > 0 and value >= 10:
            value -= 10
            notes['note_10'] -= 1
            withdraw_notes['note_10'] += 1

        while notes['note_5'] > 0 and value >= 5:
            value -= 5
            notes['note_5'] -= 1
            withdraw_notes['note_5'] += 1
        
        while notes['note_2'] > 0 and value >= 2:
            value -= 2
            notes['note_2'] -= 1
            withdraw_notes['note_2'] += 1

        if value == 0:
            return withdraw_notes
        else:
            print(value)
            return False

    def withdrawNotes(self, notes):
        currentNotes = self.selectNotes()

        sql = f"""
            UPDATE caixa_eletronico SET
            notas_2 = {(currentNotes['note_2'] - notes['note_2'])}, 
            notas_5 = {(currentNotes['note_5'] - notes['note_5'])}, 
            notas_10 = {(currentNotes['note_10'] - notes['note_10'])}, 
            notas_20 = {(currentNotes['note_20'] - notes['note_20'])}, 
            notas_50 = {(currentNotes['note_50'] - notes['note_50'])}, 
            notas_100 = {(currentNotes['note_100'] - notes['note_100'])}, 
            notas_200 = {(currentNotes['note_200'] - notes['note_200'])},
            valor_total = {(currentNotes['total'] - notes['total_value'])} 
            WHERE id = {atmId};
        """

        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            bd.conn.commit()

    def depositNotes(self, notes):
        currentNotes = self.selectNotes()
        sql = f"""
            UPDATE caixa_eletronico SET
            notas_2 = {(currentNotes['note_2'] + notes['note_2'])}, 
            notas_5 = {(currentNotes['note_5'] + notes['note_5'])}, 
            notas_10 = {(currentNotes['note_10'] + notes['note_10'])}, 
            notas_20 = {(currentNotes['note_20'] + notes['note_20'])}, 
            notas_50 = {(currentNotes['note_50'] + notes['note_50'])}, 
            notas_100 = {(currentNotes['note_100'] + notes['note_100'])}, 
            notas_200 = {(currentNotes['note_200'] + notes['note_200'])},
            valor_total = {(currentNotes['total'] + notes['total_value'])} 
            WHERE id = {atmId};
        """

        with mysql as bd:
            cursor = bd.conn.cursor()
            cursor.execute(sql)
            bd.conn.commit()
