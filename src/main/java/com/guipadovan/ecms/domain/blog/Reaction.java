package com.guipadovan.ecms.domain.blog;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "reaction_types")
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reaction_types_seq")
    @SequenceGenerator(name = "reaction_types_seq")
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String icon;
    private String color;

    public Reaction(String name, String icon, String color) {
        this.name = name;
        this.icon = icon;
        this.color = color;
    }
}