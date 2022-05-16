from flask_restx import Api
from flask import Flask
from flask_cors import CORS

class Server:
    def __init__(self):
        self.app = Flask(__name__)
        cors = CORS(self.app, resources={r'*': {'origins': 'http://localhost:4200'}})
        CORS(self.app)
        self.api = Api(self.app, 
            version='1.0',
            title='Caixa eletronico',
            description='Uma API de caixa eletrônico',
            doc='/docs'
        )

    def run(self):
        self.app.run(debug=True)


server = Server()