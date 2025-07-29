package tec.edu.azuay.shortbank.service.auth;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tec.edu.azuay.shortbank.exceptions.ObjectNotFoundException;
import tec.edu.azuay.shortbank.persistence.entity.dto.AuthRequest;
import tec.edu.azuay.shortbank.persistence.entity.dto.AuthenticationResponse;
import tec.edu.azuay.shortbank.persistence.entity.dto.UserRequest;
import tec.edu.azuay.shortbank.persistence.entity.dto.UserResponse;
import tec.edu.azuay.shortbank.persistence.entity.model.User;
import tec.edu.azuay.shortbank.service.interfaces.IUserService;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final IUserService userService;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final ModelMapper modelMapper;

    public AuthenticationResponse registerUser(UserRequest newUser) {
        User user = userService.createOneUser(newUser);

        String accessToken = jwtService.getAccessToken(user, generateExtraClaims(user));

        return AuthenticationResponse.builder().id(user.getId()).accessToken(accessToken).fullName(user.getName() + " " + user.getLastName()).build();
    }

    public UserResponse userToUserResponse(User user) {
        return modelMapper.map(user, UserResponse.class);
    }

    private Map<String, Object> generateExtraClaims(User user) {
        Map<String, Object> extraClaims = new HashMap<>();

        extraClaims.put("authorities", user.getAuthorities());
        extraClaims.put("userId", user.getId());

        return extraClaims;
    }

    public AuthenticationResponse login(AuthRequest requestAuthentication) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(requestAuthentication.getEmail(), requestAuthentication.getPassword());

        authenticationManager.authenticate(authentication);

        User user = userService.findOneByEmail(requestAuthentication.getEmail()).orElseThrow(() -> new ObjectNotFoundException("User not found"));

        String accessToken = jwtService.getAccessToken(user, generateExtraClaims(user));
        String fullName = user.getName() + " " + user.getLastName();

        return new AuthenticationResponse(user.getId(), accessToken, fullName);
    }

    public boolean validate(String jwt) {

        try {
            jwtService.extractUsername(jwt);

            return true;
        } catch (Exception e) {
            Logger.getGlobal().info(e.getMessage());
            return false;
        }
    }

    public UserResponse findLoggedInUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String username = (String) auth.getPrincipal();

        return userToUserResponse(userService.findOneByEmail(username)
                .orElseThrow(() -> new ObjectNotFoundException("User not found by username: " + username)));
    }
}
