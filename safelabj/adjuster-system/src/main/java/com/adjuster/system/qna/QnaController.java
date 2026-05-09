package com.adjuster.system.qna;

import com.adjuster.system.qna.entity.QnaItem;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/qna")
@RequiredArgsConstructor
public class QnaController {

    private static final List<Map<String, String>> CATEGORIES = List.of(
        Map.of("code", "TRAFFIC", "name", "교통사고"),
        Map.of("code", "INJURY",  "name", "상해"),
        Map.of("code", "FIRE",    "name", "화재"),
        Map.of("code", "PAYMENT", "name", "보험금지급"),
        Map.of("code", "DOC",     "name", "서류"),
        Map.of("code", "ETC",     "name", "기타")
    );

    private final QnaService qnaService;

    @GetMapping
    public String list(@RequestParam(required = false) String category,
                       @RequestParam(required = false) String keyword,
                       @RequestParam(defaultValue = "0") int page,
                       Model model) {
        model.addAttribute("qnaPage", qnaService.search(category, keyword, PageRequest.of(page, 10)));
        model.addAttribute("category", category);
        model.addAttribute("keyword", keyword);
        model.addAttribute("categories", CATEGORIES);
        return "qna/list";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        QnaItem item = qnaService.findById(id);
        model.addAttribute("item", item);
        if (item.getTags() != null && !item.getTags().isBlank()) {
            model.addAttribute("tagList", List.of(item.getTags().split("\\s*,\\s*")));
        }
        model.addAttribute("categories", CATEGORIES);
        return "qna/detail";
    }
}
