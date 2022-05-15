from flask_restx import Resource
from datetime import datetime, timedelta
import bcrypt
import cryptography
import jwt

from src.server.instance import server
from src.lib.mysql import mysql
from src.lib.authorization import adminAuthorization
from src.controllers.account import Account
from src.controllers.client import Client
from variables import secretkey


app, api = server.app, server.api

@api.route('/enter-admin')
class AdminLoginRoute(Resource):

    def post(self):
        account = Account()
        admin = Admin()
        data = api.payload

        username = data['username']
        password = data['password']

        if not account.validatePassword(password):
            return 'Senha inválida', 403

        try:
            sql = f"""
                SELECT senha FROM admin WHERE usuario = '{username}';
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
                account_data = admin.selectAccountByUsername(username)
                token = jwt.encode({"id": account_data['id'], "admin": True, 'exp': datetime.utcnow() + timedelta(minutes=60)}, secretkey, algorithm="HS256")
                account_data['token'] = token
                return account_data, 200
            else:
                return 'Autenticação inválida!', 403
        except Exception as err:
            return str(err), 500

@api.route('/admin-create')
class AdminCreateRoute(Resource):

    @adminAuthorization
    def post(self):
        client = Client()
        admin = Admin()
        data = api.payload

        username = data['username']
        name = data['name']
        surname = data['surname']
        password = data['password']

        if not client.validateName(name):
            return 'Nome é muito longo', 403
        elif not client.validateSurname(surname):
            return 'Sobrenome é muito longo', 403
        elif len(username) > 45:
            return 'Nome de usuário é muito longo', 403
        else:
            try:
                hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

                admin.insertAdminAccount(username, name, surname, hashed)

                return 'Administrador cadastrado com sucesso', 200
            except Exception as err:
                return str(err), 500

class Admin:
    def selectAccountByUsername(self, username):
        sql = f"""
                SELECT id, usuario, nome, sobrenome FROM admin WHERE usuario = '{username}';
            """
        with mysql as db:
            cursor = db.conn.cursor()
            cursor.execute(sql)
            account = cursor.fetchone()
            db.conn.commit()
        dictAccount = {
            'id': account[0],
            'user': account[1],
            'name': account[2],
            'surname': account[3],
        }
        return dictAccount

    def insertAdminAccount(self, username, name, surname, password):
        password = str(password)
        strPassword = password.replace(password[0], "", 1).replace("'", "")
        sql = f"""
                INSERT INTO admin (usuario, nome, sobrenome, senha) VALUES 
                ('{username}', '{name}', '{surname}', '{strPassword}');
            """
  
        with mysql as db:
                    cursor = db.conn.cursor()
                    cursor.execute(sql)
                    db.conn.commit()
