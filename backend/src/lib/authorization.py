from functools import wraps
from flask import request
import jwt
from datetime import datetime

from variables import secretkey
from src.server.instance import server

api = server.api

def clientAuthorization(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        id = request.args.get('id')
        if not token or token == "":
            return 'Não autorizado.', 403

        try:
            data = jwt.decode(token, secretkey, algorithms="HS256")  
            if str(data['id']) != id:
                return 'Não autorizado', 403  
        except Exception as err:
            return 'Não autorizado.', 403

        return f(*args, **kwargs)

    return decorated

def adminAuthorization(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        id = request.args.get('id')
        if not token or token == "":
            return 'Não autorizado.', 403

        try:
            data = jwt.decode(token, secretkey, algorithms="HS256")

            if str(data['id']) != id or not data['admin']:
                return 'Não autorizado.', 403
        except Exception as err:
            return 'Não autorizado', 403

        return f(*args, **kwargs)

    return decorated