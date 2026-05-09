package com.adjuster.system.controller;

import com.adjuster.system.reservation.ReservationService;
import com.adjuster.system.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final ReservationService reservationService;

    @GetMapping({"/", "/dashboard"})
    public String dashboard(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        model.addAttribute("dashboard", dashboardService.getDashboard(userDetails.getUsername()));
        model.addAttribute("todayReservations", reservationService.findTodays());
        return "dashboard/index";
    }
}
