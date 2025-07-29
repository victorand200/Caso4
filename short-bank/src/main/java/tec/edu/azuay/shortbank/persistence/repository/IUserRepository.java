package tec.edu.azuay.shortbank.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tec.edu.azuay.shortbank.persistence.entity.model.User;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByEmail(String email);
}
