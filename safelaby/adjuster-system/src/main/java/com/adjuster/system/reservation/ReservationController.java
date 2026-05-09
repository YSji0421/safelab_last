package com.adjuster.system.reservation;

import com.adjuster.system.enums.AccidentType;
import com.adjuster.system.reservation.dto.ReservationForm;
import com.adjuster.system.reservation.entity.Reservation;
import com.adjuster.system.reservation.enums.ReservationStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;

@Controller
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public String list(@RequestParam(required = false) ReservationStatus status,
                       @RequestParam(required = false) String from,
                       @RequestParam(required = false) String to,
                       @RequestParam(defaultValue = "0") int page,
                       Model model) {
        LocalDate fromDate = (from == null || from.isBlank()) ? null : LocalDate.parse(from);
        LocalDate toDate   = (to   == null || to.isBlank())   ? null : LocalDate.parse(to);
        model.addAttribute("reservations",
            reservationService.search(status, fromDate, toDate, PageRequest.of(page, 15)));
        model.addAttribute("status", status);
        model.addAttribute("from", from);
        model.addAttribute("to", to);
        model.addAttribute("statuses", ReservationStatus.values());
        return "reservation/list";
    }

    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("form", new ReservationForm());
        model.addAttribute("accidentTypes", AccidentType.values());
        return "reservation/form";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute("form") ReservationForm form,
                         BindingResult bindingResult,
                         RedirectAttributes redirectAttributes,
                         Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("accidentTypes", AccidentType.values());
            return "reservation/form";
        }
        try {
            Long id = reservationService.create(form);
            redirectAttributes.addFlashAttribute("successMsg", "예약이 등록되었습니다.");
            return "redirect:/reservations/" + id;
        } catch (Exception e) {
            model.addAttribute("errorMsg", e.getMessage());
            model.addAttribute("accidentTypes", AccidentType.values());
            return "reservation/form";
        }
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        Reservation r = reservationService.findById(id);
        model.addAttribute("r", r);
        model.addAttribute("statuses", ReservationStatus.values());
        return "reservation/detail";
    }

    @PostMapping("/{id}/status")
    public String changeStatus(@PathVariable Long id,
                               @RequestParam ReservationStatus status,
                               RedirectAttributes redirectAttributes) {
        try {
            reservationService.changeStatus(id, status);
            redirectAttributes.addFlashAttribute("successMsg", "상태가 변경되었습니다: " + status.getDisplayName());
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMsg", e.getMessage());
        }
        return "redirect:/reservations/" + id;
    }
}
