package tec.edu.azuay.shortbank.service.interfaces;

import tec.edu.azuay.shortbank.persistence.entity.dto.UserRequest;
import tec.edu.azuay.shortbank.persistence.entity.dto.UserResponse;
import tec.edu.azuay.shortbank.persistence.entity.model.User;

import java.util.Optional;

public interface IUserService {

    User createOneUser(UserRequest newUser);

    Optional<User> findOneByEmail(String email);

    UserResponse getUserResponse(String username);
}
