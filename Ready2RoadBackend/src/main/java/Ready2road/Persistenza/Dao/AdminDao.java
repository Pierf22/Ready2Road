package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Admin;

import java.util.List;

public interface AdminDao {
    Admin findByPrimaryKey(String username, String password);

    boolean isAdminPresente(String username);

    Admin findByUsername(String username);

    List<Admin> findAll();
}
