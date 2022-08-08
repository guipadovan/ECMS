package com.guipadovan.ecms.config;

import com.guipadovan.ecms.domain.Permission;
import com.guipadovan.ecms.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {

    private final JWTTokenHelper tokenHelper;
    private final AppUserService appUserService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public WebSecurityConfig(JWTTokenHelper tokenHelper, AppUserService appUserService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.tokenHelper = tokenHelper;
        this.appUserService = appUserService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().exceptionHandling().authenticationEntryPoint((request, response, ex) ->
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage()))
                .and().authorizeRequests((request) ->
                        request.antMatchers("/api/v1/auth/**").permitAll()
                                .antMatchers("/api/v1/post/*").permitAll()
                                .antMatchers("/api/v1/post/posts").permitAll()
                                .antMatchers("/api/v1/post/new").hasAuthority(Permission.ACCESS_ADD_POST.name())
                                .antMatchers("/api/v1/post/*/update").hasAuthority(Permission.POST_EDIT.name())
                                .antMatchers("/api/v1/post/*/switch-lock").hasAuthority(Permission.POST_LOCK.name())
                                .antMatchers("/api/v1/post/*/comment").hasAuthority(Permission.POST_COMMENT.name())
                                .antMatchers("/api/v1/post/*/reaction").hasAuthority(Permission.POST_REACT.name())
                                .antMatchers("/api/v1/post/*/delete").hasAuthority(Permission.POST_DELETE.name())
                                .antMatchers("/api/v1/user/users").hasAuthority(Permission.ACCESS_USERS.name())
                                .antMatchers("/api/v1/user/*/ban").hasAuthority(Permission.MODERATE_BAN.name())
                                .antMatchers("/api/v1/user/*/unban").hasAuthority(Permission.MODERATE_UNBAN.name())
                                .antMatchers("/api/v1/user/*/delete").hasAuthority(Permission.USER_DELETE.name())
                                .antMatchers("/api/v1/user/*/enable").hasAuthority(Permission.USER_ENABLE.name())
                                .antMatchers("/api/v1/user/*/disable").hasAuthority(Permission.USER_DISABLE.name())
                                .anyRequest().authenticated())
                .addFilterBefore(new JWTTokenFilter(tokenHelper, appUserService), UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(daoAuthenticationProvider());
        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        provider.setUserDetailsService(appUserService);
        return provider;
    }

}
