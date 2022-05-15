from src.server.instance import server

from src.controllers.account import AccountRoute
from src.controllers.client import ClientRoute, ClientListRoute
from src.controllers.transfer import TransferRoute
from src.controllers.login import LoginRoute
from src.controllers.withdraw import WithdrawRoute
from src.controllers.deposit import DepositRoute
from src.controllers.admin import AdminLoginRoute, AdminCreateRoute
from src.controllers.transactions import TransactionRoute
from src.controllers.atm import ATMRoute

if __name__ == "__main__":
    server.run()