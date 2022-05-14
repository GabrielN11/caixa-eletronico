from flask_restx import Api
from flask import Flask

class Server:
    def __init__(self):
        self.app = Flask(__name__)
        self.api = Api(self.app, 
            version='1.0',
            title='Caixa eletronico',
            description='Uma API de caixa eletrônico',
            doc='/docs'
        )

    def run(self):
        self.app.run(debug=True)


server = Server()