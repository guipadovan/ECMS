package com.guipadovan.ecms.domain.blog;

import com.guipadovan.ecms.domain.AppUser;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_seq")
    @SequenceGenerator(name = "post_seq")
    @Column(name = "id", nullable = false)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private AppUser author;
    @ManyToOne(optional = false)
    @JoinColumn(name = "last_updated_by_id", nullable = false)
    private AppUser lastUpdatedBy;
    @Column(nullable = false)
    private String title;
    private String subtitle;
    @Column(nullable = false, columnDefinition = "MEDIUMTEXT")
    private String text;
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Collection<PostReaction> reactions = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Collection<PostComment> comments = new ArrayList<>();
    @Column(nullable = false)
    private LocalDateTime postedAt, updatedAt;
    private boolean locked;

    public Post(AppUser author, String title, String subtitle, String text, LocalDateTime postedAt, boolean locked) {
        this.author = author;
        this.lastUpdatedBy = author;
        this.title = title;
        this.subtitle = subtitle;
        this.text = text;
        this.postedAt = postedAt;
        this.updatedAt = postedAt;
        this.locked = locked;
    }
}