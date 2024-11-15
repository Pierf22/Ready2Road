package Ready2road.Persistenza;

import Ready2road.Persistenza.Dao.*;
import Ready2road.Persistenza.Dao.Postgres.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBManager {
        private static DBManager instance = null;
        private DBManager(){}
        public static DBManager getInstance(){
            if (instance == null){
                instance = new DBManager();
            }
            return instance;
        }
        Connection con = null;

        public Connection getConnection(){
                try {
                    if (con == null || con.isClosed() || !con.isValid(1)) {

                        con = DriverManager.getConnection("YOUR POSTGRES DB URL", "YOUR POSTGRES USERNAME", "YOUR POSTGRES PASSWORD");
                    }} catch (SQLException e) {
                    throw new RuntimeException(e);
                }

            return con;
        }
        public AdminDao getAdminDao(){return new AdminDaoPostgres(getConnection());};
        public BigliettoDao getBigliettoDao(){return new BigliettoDaoPostgres(getConnection());}
        public BuonoDao getBuonoDao(){return new BuonoDaoPostgres(getConnection());}
        public CartaPagamentoDao getCartaPagamentoDao(){return new CartaPagamentoDaoPostgres(getConnection());}
        public ContoCorrenteDao getContoCorrenteDao(){return new ContoCorrenteDaoPostgres(getConnection());}
        public MetodoPagamentoDao getMetodoPagamentoDao(){return new MetodoPagamentoDaoPostgres(getConnection());}
        public TransazioneDao getTransazioneDao(){return new TransazioneDaoPostgres(getConnection());}
        public TrattaDao getTrattaDao(){return new TrattaDaoPostgres(getConnection());}
        public UtenteDao getUtenteDao(){return new UtenteDaoPostgres(getConnection());}
        public VenditoreDao getVenditoreDao(){return new VenditoreDaoPostgres(getConnection());}
        public WalletDao getWalletDao(){return new WalletDaoPostgres(getConnection());}

    public ConversazioneDao getConversazioneDao() {
        return new ConversazioneDaoPostgres(getConnection());
    }
    public TappeDao getTappeDao() {
        return new TappeDaoPostgres(getConnection());
    }

    public MessaggioDao getMessaggioDao() {
        return new MessaggioDaoPostgres(getConnection());
    }
}
