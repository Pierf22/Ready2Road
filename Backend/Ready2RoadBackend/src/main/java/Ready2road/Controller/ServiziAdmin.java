package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.AdminDao;
import Ready2road.Persistenza.Model.Admin;
import com.google.gson.JsonArray;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200/")
public class ServiziAdmin {
    @GetMapping("/admins")
    public String getAllAdmin(HttpServletRequest request){
        JsonArray array=new JsonArray();
        AdminDao adminDao= DBManager.getInstance().getAdminDao();
        for(Admin admin:adminDao.findAll()){
            array.add(admin.toJson());
        }

        return array.toString();
    }
}
