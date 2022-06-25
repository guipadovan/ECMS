package com.guipadovan.ecms.service;

import com.guipadovan.ecms.api.request.AuthRequest;
import com.guipadovan.ecms.api.request.RegisterRequest;
import com.guipadovan.ecms.api.response.AuthResponse;
import com.guipadovan.ecms.config.JWTTokenHelper;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.ConfirmationToken;
import com.guipadovan.ecms.service.utils.EmailValidator;
import lombok.extern.slf4j.Slf4j;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JWTTokenHelper tokenHelper;
    private final AppUserService appUserService;
    private final EmailValidator emailValidator;
    private final EmailService emailService;

    @Autowired
    public AuthServiceImpl(AuthenticationManager authenticationManager, JWTTokenHelper tokenHelper, AppUserService appUserService, EmailValidator emailValidator, EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.tokenHelper = tokenHelper;
        this.appUserService = appUserService;
        this.emailValidator = emailValidator;
        this.emailService = emailService;
    }

    @Override
    public ResponseEntity<String> register(RegisterRequest registerRequest) {
        if (registerRequest.username() == null)
            throw new IllegalStateException("Username can't be null");
        else if (registerRequest.email() == null)
            throw new IllegalStateException("Email can't be null");
        else if (!emailValidator.test(registerRequest.email()))
            throw new IllegalStateException("Invalid email format");
        else if (registerRequest.password() == null)
            throw new IllegalStateException("Password can't be null");
        else if (registerRequest.confirmPassword() == null)
            throw new IllegalStateException("Password confirmation can't be null");

        AppUser appUser = appUserService.saveUser(new AppUser(registerRequest.username(), registerRequest.email(), registerRequest.password())).orElseThrow();

        generateAndSendConfirmationToken(appUser);

        log.info("Sending register response to frontend");
        return ResponseEntity.ok("User " + appUser.getUsername() + " saved successfully");
    }

    @Override
    public ResponseEntity<String> login(AuthRequest authRequest) {
        JSONObject jsonResponse = new JSONObject();

        AppUser appUser = appUserService.getUser(authRequest.username()).orElseThrow(() -> new IllegalStateException("Username not registered"));

        if (!appUser.isEnabled())
            throw new IllegalStateException("Account not confirmed");

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            if (authentication.isAuthenticated()) {
                try {
                    jsonResponse.put("token", tokenHelper.createToken(authRequest.username()));
                    jsonResponse.put("user", new AuthResponse(appUser.getId(), appUser.getUsername(), appUser.getEmail(), appUser.getRoles(), appUser.isLocked()));
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                return new ResponseEntity<>(jsonResponse.toString(), HttpStatus.OK);
            }
        } catch (AuthenticationException ignored) {
        }

        throw new IllegalStateException("Incorrect username or password");
    }

    @Override
    public ResponseEntity<String> confirmToken(String token) {
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

    @Override
    public ResponseEntity<String> changePassword() {
        return null;
    }

    @Override
    public ResponseEntity<String> forgetPassword() {
        return null;
    }

    private void generateAndSendConfirmationToken(AppUser appUser) {
        appUserService.saveConfirmationToken(new ConfirmationToken(UUID.randomUUID().toString(), LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(10), appUser)).ifPresent(token -> {
            String confirmationLink = "http://localhost:8080/api/v1/auth/confirm?token=" + token.getToken();
            emailService.send(appUser.getEmail(), "Confirm your account", confirmationEmail("", confirmationLink));
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
