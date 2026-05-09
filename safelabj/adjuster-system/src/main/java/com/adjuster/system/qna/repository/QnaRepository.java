package com.adjuster.system.qna.repository;

import com.adjuster.system.qna.entity.QnaItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QnaRepository extends JpaRepository<QnaItem, Long> {

    @Query("""
        SELECT q FROM QnaItem q
         WHERE (:category IS NULL OR :category = '' OR q.category = :category)
           AND (:keyword  IS NULL OR :keyword = '' OR
                LOWER(q.title)   LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(q.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(q.tags)    LIKE LOWER(CONCAT('%', :keyword, '%')))
         ORDER BY q.id DESC
    """)
    Page<QnaItem> search(@Param("category") String category,
                         @Param("keyword") String keyword,
                         Pageable pageable);
}
