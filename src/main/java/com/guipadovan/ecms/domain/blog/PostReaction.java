package com.guipadovan.ecms.domain.blog;

import com.guipadovan.ecms.domain.AppUser;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "post_reactions")
public class PostReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_reaction_seq")
    @SequenceGenerator(name = "post_reaction_seq")
    @Column(name = "id", nullable = false)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;
    @ManyToOne(optional = false)
    @JoinColumn(name = "reaction_id", nullable = false)
    private Reaction reaction;

    public PostReaction(AppUser appUser, Reaction reaction) {
        this.appUser = appUser;
        this.reaction = reaction;
    }
}