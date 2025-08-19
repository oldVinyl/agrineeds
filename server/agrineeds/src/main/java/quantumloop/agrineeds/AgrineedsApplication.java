package quantumloop.agrineeds;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AgrineedsApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgrineedsApplication.class, args);
    }

}

/*
* config = springConfig
* controller = userController
* entities = User
* models = UserDTO
* repository = DBConnect.java, UserRepository
* services = UserService
* utils = JwtAuthentificationFilter, JWTUtils
* */
