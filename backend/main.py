from src.server.instance import server

from src.controllers.account import AccountRoute, TransferRoute, LoginRoute
from src.controllers.client import ClientRoute

if __name__ == "__main__":
    server.run()