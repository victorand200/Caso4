package tec.edu.azuay.shortbank.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tec.edu.azuay.shortbank.persistence.entity.dto.AuthRequest;
import tec.edu.azuay.shortbank.persistence.entity.dto.UserRequest;
import tec.edu.azuay.shortbank.service.auth.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody AuthRequest userRequest) {
        return ResponseEntity.ok(authService.login(userRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody UserRequest userRequest)  {

        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(userRequest));
    }

    @PreAuthorize("hasAuthority('READ_MY_PROFILE')")
    @GetMapping("/profile")
    public ResponseEntity<?> getLoggedProfile() {
        return ResponseEntity.ok(authService.findLoggedInUser());
    }
}
