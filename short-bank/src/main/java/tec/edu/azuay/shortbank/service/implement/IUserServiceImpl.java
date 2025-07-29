package tec.edu.azuay.shortbank.service.implement;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import tec.edu.azuay.shortbank.exceptions.ExistsObjectException;
import tec.edu.azuay.shortbank.exceptions.ObjectNotFoundException;
import tec.edu.azuay.shortbank.persistence.entity.dto.AuthenticationResponse;
import tec.edu.azuay.shortbank.persistence.entity.dto.UserRequest;
import tec.edu.azuay.shortbank.persistence.entity.dto.UserResponse;
import tec.edu.azuay.shortbank.persistence.entity.model.User;
import tec.edu.azuay.shortbank.persistence.repository.IUserRepository;
import tec.edu.azuay.shortbank.service.interfaces.IUserService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IUserServiceImpl implements IUserService {

    private final ModelMapper modelMapper;

    private final IUserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private User dtoToUser(UserRequest request) {
        return modelMapper.map(request, User.class);
    }

    private AuthenticationResponse entityToAuthResponse(User user) {
        return modelMapper.map(user, AuthenticationResponse.class);
    }

    private UserResponse entityToDto(User user) {
        return modelMapper.map(user, UserResponse.class);
    }

    @Override
    public User createOneUser(UserRequest newUser) {
        Optional<User> presentUser = findOneByEmail(newUser.getEmail());

        if (!ObjectUtils.isEmpty(presentUser)) {
            throw new ExistsObjectException();
        }

        User user = dtoToUser(newUser);
        user.setPassword(passwordEncoder.encode(newUser.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public Optional<User> findOneByEmail(String email) {
        return userRepository.findOneByEmail(email);
    }

    @Override
    public UserResponse getUserResponse(String username) {
        return entityToDto(findOneByEmail(username).orElseThrow(ObjectNotFoundException::new));
    }
}
