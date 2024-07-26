package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Dao.AdminDao;
import Ready2road.Persistenza.Model.Admin;
import Ready2road.Persistenza.Model.Utente;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AdminDaoPostgres implements AdminDao {
    Connection connection;

    public AdminDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public Admin findByPrimaryKey(String username, String password) {
        Admin admin=null;
        try {

            String query = "select * from admin where username=? and password=?";
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, password);
            ResultSet rs = preparedStatement.executeQuery();

            if (rs.next()){
                admin=new Admin();
                admin.setUsername(rs.getString("username"));
                admin.setCognome(rs.getString("cognome"));
                admin.setNome(rs.getString("nome"));
                admin.setPassword(rs.getString("password"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return admin;
    }

    @Override
    public boolean isAdminPresente(String username) {
            boolean result=false;
            String query="select * from admin where username=?";
            try{
                PreparedStatement st=connection.prepareStatement(query);
                st.setString(1,username);
                ResultSet rs=st.executeQuery();
                if(rs.next())
                    result=true;

            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
            return result;
        }

    @Override
    public Admin findByUsername(String username) {
        Admin admin=null;
        try {

            String query = "select * from admin where username=? ";
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1, username);
            ResultSet rs = preparedStatement.executeQuery();

            if (rs.next()){
                admin=new Admin();
                admin.setUsername(rs.getString("username"));
                admin.setCognome(rs.getString("cognome"));
                admin.setNome(rs.getString("nome"));
                admin.setPassword(rs.getString("password"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return admin;
    }

    @Override
    public List<Admin> findAll() {
        List<Admin> admins=new ArrayList<>();
        String query="select * from admin";
        try{
            PreparedStatement statement=connection.prepareStatement(query);
            ResultSet resultSet= statement.executeQuery();
            while (resultSet.next()){
                Admin admin=new Admin();
                admin.setNome(resultSet.getString("nome"));
                admin.setCognome(resultSet.getString("cognome"));
                admin.setUsername(resultSet.getString("username"));
                admin.setPassword(resultSet.getString("password"));
                admins.add(admin);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return admins;
    }

}

