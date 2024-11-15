package Ready2road.Persistenza.IdBrokers;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.BigliettoDao;
import Ready2road.Persistenza.Dao.TrattaDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

public class IdBrokerBiglietto {

    public static int getPosto(String trattaID) {
        BigliettoDao bigliettoDao= DBManager.getInstance().getBigliettoDao();
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        List<Integer> postiOccupati=bigliettoDao.getPostiOccupati(trattaID);
        int capienzaTratta=trattaDao.getCapienzaTratta(trattaID);
        Random rand=new Random();
        int posto=rand.nextInt((capienzaTratta ) + 1);
        while(postiOccupati.contains(posto)){
            posto=rand.nextInt((capienzaTratta ) + 1);
        }




        return posto;


    }
}
