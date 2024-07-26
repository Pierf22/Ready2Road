package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.*;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200/")
public class ServiziStatistiche {

    @GetMapping("/statistichePrincipaliAdmin")
    public String dammiStatistichePrincipaliAdmin(HttpServletRequest req){
        UtenteDao utenteDao= DBManager.getInstance().getUtenteDao();
        VenditoreDao venditoreDao=DBManager.getInstance().getVenditoreDao();
        BigliettoDao bigliettoDao=DBManager.getInstance().getBigliettoDao();
        TransazioneDao transazioneDao=DBManager.getInstance().getTransazioneDao();
        int[] statistiche = new int[4];
        statistiche[0]=utenteDao.getNumeroTotaleDiUtenti();
        statistiche[1]=venditoreDao.getNumeroTotaleDiVenditori();
        statistiche[2]=bigliettoDao.getNumeroTotaleDiBigliettiVenduti();
        statistiche[3]=transazioneDao.getNumeroTotaleDiTransazioni();
        JsonArray jsonArray=new JsonArray();
        for(int i=0;i<statistiche.length;i++){
            jsonArray.add(statistiche[i]);
        }
        return jsonArray.toString();
    }
    @GetMapping("/statistichePieChartMetodiPagamento")
    public String dammiStatistichePieChartMetodiPagamento(HttpServletRequest req){
        TransazioneDao transazioneDao=DBManager.getInstance().getTransazioneDao();


        Gson gson=new Gson();
        return gson.toJson(transazioneDao.getNumeroDiTransazioniPerMetodoDiPagamento());
    }
    @GetMapping("/statisticheVenditePerAnno/{anno}")
    public String dammiVenditeVenditoriDiUnAnno(HttpServletRequest req, @PathVariable int anno){
        TrattaDao trattaDao=DBManager.getInstance().getTrattaDao();
        Gson gson=new Gson();
        return gson.toJson(trattaDao.getNumeroDiVenditeBigliettiPerAnno(anno));
    }
    @GetMapping("/rendimenti")
    public String dammiRendimentiInUnGiorno(HttpServletRequest req){
        String dataInizio=req.getParameter("dataInizio");
        String dataFine=req.getParameter("dataFine");

        Date inizio=null;
        Date fine=null;

        SimpleDateFormat dateFormat=new SimpleDateFormat("dd/MM/yyyy");
        try{
             inizio=dateFormat.parse(dataInizio);
                fine=dateFormat.parse(dataFine);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        TransazioneDao transazioneDao=DBManager.getInstance().getTransazioneDao();
        Gson gson=new Gson();
        return gson.toJson(transazioneDao.getRendimentiInUnGapDiDate(inizio, fine));
    }
    @GetMapping("/statistichePrincipaliVenditore")
    public String dammiStatistichePrincipaliVenditore(HttpServletRequest req){
        String nomeSocieta=req.getParameter("nomeSocieta");
        VenditoreDao venditoreDao=DBManager.getInstance().getVenditoreDao();
        TrattaDao trattaDao=DBManager.getInstance().getTrattaDao();
        BigliettoDao bigliettoDao=DBManager.getInstance().getBigliettoDao();
        TransazioneDao transazioneDao=DBManager.getInstance().getTransazioneDao();
        int[] statistiche = new int[4];
        statistiche[0]=venditoreDao.getNumeroClientiPerVenditore(nomeSocieta);
        statistiche[1]=trattaDao.getNumeroTratteOfferteDaVenditore(nomeSocieta);
        statistiche[2]=bigliettoDao.getNumeroBigliettiVendutiVenditore(nomeSocieta);
        statistiche[3]=transazioneDao.getNumeroTransazioniWallet(nomeSocieta);
        JsonArray jsonArray=new JsonArray();
        for(int i=0;i<statistiche.length;i++){
            jsonArray.add(statistiche[i]);
        }
        return jsonArray.toString();
    }
    @GetMapping("/statistichePieChartBiglietti")
    public String dammiStatistichePieChartBiglietti(HttpServletRequest req){
        BigliettoDao bigliettoDao=DBManager.getInstance().getBigliettoDao();
        String nomeSocieta=req.getParameter("nomeSocieta");
        Gson gson=new Gson();
        return gson.toJson(bigliettoDao.getStatisticheBiglietti(nomeSocieta));
    }
    @GetMapping("/statisticheVendite")
    public String getStatisticheVenditeVenditorePerAnno(HttpServletRequest req){
        String nomeSocieta=req.getParameter("nomeSocieta");
        int anno=Integer.parseInt(req.getParameter("anno"));
        BigliettoDao bigliettoDao=DBManager.getInstance().getBigliettoDao();
        Gson gson=new Gson();
        return  gson.toJson(bigliettoDao.getNumeroBigliettiVendutiAnno(nomeSocieta, anno));
}
    @GetMapping("/rendimentiVenditore")
    public String dammiRendimentiVenditoreUnGiorno(HttpServletRequest req){
        String dataInizio=req.getParameter("dataInizio");
        String dataFine=req.getParameter("dataFine");
        String nomeSocieta=req.getParameter("nomeSocieta");

        Date inizio=null;
        Date fine=null;

        SimpleDateFormat dateFormat=new SimpleDateFormat("dd/MM/yyyy");
        try{
            inizio=dateFormat.parse(dataInizio);
            fine=dateFormat.parse(dataFine);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        TransazioneDao transazioneDao=DBManager.getInstance().getTransazioneDao();
        Gson gson=new Gson();
        return gson.toJson(transazioneDao.getRendimentiInUnGapDiDateSingoloVenditore(inizio, fine, nomeSocieta));
    }
}
