package com.guipadovan.ecms.config;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.Permission;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JWTTokenHelper {

    private final SignatureAlgorithm SIGNATURE_ALGORITHM = SignatureAlgorithm.HS256;
    @Value("${jwt.auth.app}")
    private String appName;
    @Value("${jwt.auth.secret_key}")
    private String secretKey;
    @Value("${jwt.auth.expiration.access}")
    private int accessExpiresIn;
    @Getter
    @Value("${jwt.auth.expiration.refresh}")
    private int refreshExpiresIn;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createAccessToken(AppUser appUser) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", appUser.getId());
        claims.put("email", appUser.getEmail());
        claims.put("roles", appUser.getRole().getName());
        claims.put("permissions", appUser.getRole().getPermissions().stream().map(Permission::name).collect(Collectors.toList()));
        claims.put("createdAt", appUser.getCreatedAt().toString());
        claims.put("locked", appUser.isLocked());
        return Jwts.builder()
                .setClaims(claims)
                .setIssuer(appName)
                .setSubject(appUser.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(generateExpirationDate(accessExpiresIn))
                .signWith(SIGNATURE_ALGORITHM, secretKey)
                .compact();
    }

    public String createRefreshToken(AppUser appUser, int expiresIn) {
        return Jwts.builder()
                .setIssuer(appName)
                .setSubject(appUser.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(generateExpirationDate(expiresIn))
                .signWith(SIGNATURE_ALGORITHM, secretKey)
                .compact();
    }

    public String createRefreshToken(AppUser appUser) {
        return createRefreshToken(appUser, refreshExpiresIn);
    }

    public boolean validateToken(String token) {
        try {
            final String username = getUsernameFromToken(token);
            return (username != null && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        return getExpirationDate(token).before(new Date());
    }

    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    private Date getExpirationDate(String token) {
        return getClaimsFromToken(token).getExpiration();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    private Date generateExpirationDate(int minutes) {
        return new Date(System.currentTimeMillis() + minutes * 60 * 1000L);
    }
}
