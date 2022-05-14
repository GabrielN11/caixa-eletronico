from src.server.instance import server

from src.controllers.account import AccountRoute
from src.controllers.client import ClientRoute
from src.controllers.transfer import TransferRoute
from src.controllers.login import LoginRoute
from src.controllers.withdraw import WithdrawRoute
from src.controllers.deposit import DepositRoute

if __name__ == "__main__":
    server.run()