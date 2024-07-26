package Ready2road;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class Ready2RoadBackendApplication {

    public static void main(String[] args) {

        SpringApplication.run(Ready2RoadBackendApplication.class, args);
    }

}
