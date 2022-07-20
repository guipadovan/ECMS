package com.guipadovan.ecms.api;

import com.guipadovan.ecms.api.request.AuthRequest;
import com.guipadovan.ecms.api.request.RegisterRequest;
import com.guipadovan.ecms.api.response.AuthResponse;
import com.guipadovan.ecms.config.JWTTokenHelper;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.ConfirmationToken;
import com.guipadovan.ecms.service.AppUserService;
import com.guipadovan.ecms.service.EmailService;
import com.guipadovan.ecms.service.utils.EmailValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JWTTokenHelper tokenHelper;
    private final AppUserService appUserService;
    private final EmailValidator emailValidator;
    private final EmailService emailService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JWTTokenHelper tokenHelper, AppUserService appUserService, EmailValidator emailValidator, EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.tokenHelper = tokenHelper;
        this.appUserService = appUserService;
        this.emailValidator = emailValidator;
        this.emailService = emailService;
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        AppUser appUser = appUserService.getUser(authRequest.username()).orElseThrow(() -> new UsernameNotFoundException("Username not registered"));

        if (!appUser.isEnabled())
            throw new IllegalStateException("Account not confirmed");

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        if (authentication.isAuthenticated()) {

            // TODO set secure cookie
            ResponseCookie refreshToken = ResponseCookie.from("jwt", tokenHelper.createRefreshToken(appUser))
                    .httpOnly(true).path("/").maxAge(tokenHelper.getRefreshExpiresIn() * 60L).build();

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, refreshToken.toString())
                    .body(new AuthResponse(tokenHelper.createAccessToken(appUser)));
        }

        throw new BadCredentialsException("Incorrect username or password");
    }

    @GetMapping(value = "/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(value = "jwt") String token) {
        AppUser appUser = appUserService.getUser(tokenHelper.getUsernameFromToken(token)).orElseThrow(() -> new IllegalStateException("User doesn't exist"));

        if (!tokenHelper.validateToken(token))
            throw new IllegalStateException("Invalid token");

        return ResponseEntity.ok(new AuthResponse(tokenHelper.createAccessToken(appUser)));
    }

    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        if (registerRequest.username() == null)
            throw new IllegalStateException("Invalid username");
        else if (registerRequest.email() == null)
            throw new IllegalStateException("Invalid email");
        else if (!emailValidator.test(registerRequest.email()))
            throw new IllegalStateException("Invalid email format");
        else if (registerRequest.password() == null)
            throw new IllegalStateException("Invalid password");
        else if (registerRequest.confirmPassword() == null)
            throw new IllegalStateException("Invalid password confirmation");

        AppUser appUser = appUserService.saveUser(new AppUser(registerRequest.username(), registerRequest.email(), registerRequest.password(), LocalDateTime.now())).orElseThrow();

        generateAndSendConfirmationToken(appUser);

        log.info("Sending register response to frontend");
        return ResponseEntity.ok("User " + appUser.getUsername() + " saved successfully");
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirmToken(@RequestParam("token") String token) {
        ConfirmationToken confirmationToken = appUserService.getConfirmationToken(token).orElseThrow(() -> new IllegalStateException("Token not found"));

        if (confirmationToken.getConfirmedAt() != null)
            throw new IllegalStateException("Account already confirmed");
        else if (confirmationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            generateAndSendConfirmationToken(confirmationToken.getAppUser());
            throw new IllegalStateException("Token expired");
        }

        appUserService.setConfirmedAt(token);
        appUserService.enableUser(confirmationToken.getAppUser().getUsername());

        log.info("Sending token confirmation response to frontend");
        return ResponseEntity.ok("Token " + token + " confirmed successfully");
    }

    private void generateAndSendConfirmationToken(AppUser appUser) {
        appUserService.saveConfirmationToken(new ConfirmationToken(UUID.randomUUID().toString(), LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(10), appUser)).ifPresent(token -> {
            String confirmationLink = "http://localhost:8080/api/v1/auth/confirm?token=" + token.getToken();
            emailService.send(appUser.getEmail(), "Confirm your account", confirmationEmail(appUser.getUsername(), confirmationLink));
        });
    }

    private String confirmationEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 15 minutes. <p>See you soon</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

}
