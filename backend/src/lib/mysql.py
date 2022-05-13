import pymysql
import variables

class MySqlCon:
    def __init__(self,
        user=variables.user,
        password=variables.password,
        host=variables.host,
        database=variables.database
    ):
        self.user = user
        self.password = password
        self.host = host
        self.database = database
        self.conn = None

    def __enter__(self):
        self.criarConexao()
        return self

    def __exit__(self, type, value, traceback):
        self.conn.close()

    def criarConexao(self):
        try:
            self.conn = pymysql.connect(
                user=self.user,
                password=self.password,
                host=self.host,
                database=self.database
            )
        except pymysql.DatabaseError as err:
            print(err)

mysql = MySqlCon()
