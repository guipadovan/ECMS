package com.guipadovan.ecms.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "role_seq")
    @SequenceGenerator(name = "role_seq")
    @Column(name = "id", nullable = false)
    private Long id;
    private String name;
    @ElementCollection
    private List<Permission> permissions;

    public Role(String name, List<Permission> permissions) {
        this.name = name;
        this.permissions = permissions;
    }
}