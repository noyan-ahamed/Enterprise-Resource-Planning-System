package com.erp.controllers;

import com.erp.config.AuthenticationService;
import com.erp.enities.AuthenticationResponse;
import com.erp.enities.AuthenticationRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authentication")
@RequiredArgsConstructor
public class JwtController {
    private final AuthenticationService service;

//    @PostMapping("/register")
//    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest){
//        return ResponseEntity.ok(service.register(registerRequest));
//    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest authenticationRequest,
             HttpServletResponse response
    ){
        AuthenticationResponse authResponse =
                service.authenticate(authenticationRequest);

        Cookie cookie =
                new Cookie("jwt", authResponse.getToken());

        cookie.setHttpOnly(true);

        // production এ true
        cookie.setSecure(false);
        cookie.setPath("/");
//        cookie.setMaxAge(60 * 60 * 24); //i want when browser or tab close login.
        response.addCookie(cookie);
        authResponse.setToken(null);
        return ResponseEntity.ok(authResponse);
    }

//    for delete cookie
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){

        Cookie cookie = new Cookie("jwt", null);

        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");

        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out");
    }

}
