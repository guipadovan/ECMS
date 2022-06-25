package com.guipadovan.ecms.domain.blog;

import com.guipadovan.ecms.domain.AppUser;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "post_comments")
public class PostComment {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comment_seq")
    @SequenceGenerator(name = "comment_seq")
    @Column(name = "id", nullable = false)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private AppUser author;
    @Column(nullable = false)
    private String text;
    @Column(nullable = false)
    private LocalDateTime postedAt;

    public PostComment(AppUser author, String text, LocalDateTime postedAt) {
        this.author = author;
        this.text = text;
        this.postedAt = postedAt;
    }
}