package com.adjuster.system.qna;

import com.adjuster.system.qna.entity.QnaItem;
import com.adjuster.system.qna.repository.QnaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QnaService {

    private final QnaRepository qnaRepository;

    public Page<QnaItem> search(String category, String keyword, Pageable pageable) {
        String c = (category == null || category.isBlank()) ? null : category.trim();
        String k = (keyword  == null || keyword.isBlank())  ? null : keyword.trim();
        return qnaRepository.search(c, k, pageable);
    }

    public QnaItem findById(Long id) {
        return qnaRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Q&A 항목을 찾을 수 없습니다. id=" + id));
    }
}
