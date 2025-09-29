package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.response.DashboardStatsDTO;
import com.slneurorobotics.backend.entity.Payment;
import com.slneurorobotics.backend.repository.PaymentRepository;
import com.slneurorobotics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekAgo = now.minusWeeks(1);
        LocalDateTime twoWeeksAgo = now.minusWeeks(2);

        calculateSalesMetrics(stats, weekAgo, twoWeeksAgo);
        calculateActiveUsersMetrics(stats, weekAgo, twoWeeksAgo);
        calculateRefundMetrics(stats, weekAgo, twoWeeksAgo);
        calculateEarningsOverview(stats);

        return stats;
    }

    private void calculateEarningsOverview(DashboardStatsDTO stats) {
        LocalDateTime fourteenDaysAgo = LocalDateTime.now().minusDays(14);
        List<Payment> recentPayments = paymentRepository.findRecentPayments(fourteenDaysAgo);

        List<Payment> succeededPayments = recentPayments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.SUCCEEDED)
                .toList();

        Map<String, BigDecimal> dailyEarnings = new java.util.LinkedHashMap<>();
        LocalDateTime startDate = LocalDateTime.now().minusDays(13);

        for (int i = 0; i < 14; i++) {
            LocalDateTime currentDay = startDate.plusDays(i);
            String dayLabel = currentDay.format(java.time.format.DateTimeFormatter.ofPattern("EEE"));
            dailyEarnings.put(dayLabel, BigDecimal.ZERO);
        }

        for (Payment payment : succeededPayments) {
            String dayLabel = payment.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("EEE"));
            dailyEarnings.merge(dayLabel, payment.getAmount(), BigDecimal::add);
        }

        List<DashboardStatsDTO.DailyEarning> earningsOverview = dailyEarnings.entrySet().stream()
                .map(entry -> new DashboardStatsDTO.DailyEarning(entry.getKey(), entry.getValue()))
                .toList();

        stats.setEarningsOverview(earningsOverview);
    }

    private void calculateSalesMetrics(DashboardStatsDTO stats, LocalDateTime weekAgo, LocalDateTime twoWeeksAgo) {
        List<Payment> succeededPayments = paymentRepository.findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus.SUCCEEDED);

        BigDecimal totalSales = succeededPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalSalesAmount(totalSales);
        stats.setTotalOrderCount((long) succeededPayments.size());

        BigDecimal thisWeekSales = succeededPayments.stream()
                .filter(p -> p.getCreatedAt().isAfter(weekAgo))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lastWeekSales = succeededPayments.stream()
                .filter(p -> p.getCreatedAt().isAfter(twoWeeksAgo) && p.getCreatedAt().isBefore(weekAgo))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal salesChange = thisWeekSales.subtract(lastWeekSales);
        stats.setSalesChangeCount(salesChange);

        if (lastWeekSales.compareTo(BigDecimal.ZERO) > 0) {
            double percentage = salesChange.divide(lastWeekSales, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            stats.setSalesChangePercentage(percentage);
        } else {
            stats.setSalesChangePercentage(thisWeekSales.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0);
        }
    }

    private void calculateActiveUsersMetrics(DashboardStatsDTO stats, LocalDateTime weekAgo, LocalDateTime twoWeeksAgo) {
        Long activeUsersCount = userRepository.countByIsActive(true);
        stats.setActiveUsersCount(activeUsersCount);

        Long thisWeekActiveUsers = userRepository.countByIsActiveAndLastLoginAfter(true, weekAgo);
        Long lastWeekActiveUsers = userRepository.countByIsActiveAndLastLoginBetween(true, twoWeeksAgo, weekAgo);

        Long usersChange = thisWeekActiveUsers - lastWeekActiveUsers;
        stats.setActiveUsersChangeCount(usersChange);

        if (lastWeekActiveUsers > 0) {
            double percentage = ((double) usersChange / lastWeekActiveUsers) * 100;
            stats.setActiveUsersChangePercentage(percentage);
        } else {
            stats.setActiveUsersChangePercentage(thisWeekActiveUsers > 0 ? 100.0 : 0.0);
        }

        stats.setAverageTimeOnSite("4:36m");
    }

    private void calculateRefundMetrics(DashboardStatsDTO stats, LocalDateTime weekAgo, LocalDateTime twoWeeksAgo) {
        Long totalRefunds = paymentRepository.countByStatus(Payment.PaymentStatus.CANCELLED);
        stats.setRefundCount(totalRefunds);

        List<Payment> allCancelled = paymentRepository.findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus.CANCELLED);

        long thisWeekRefunds = allCancelled.stream()
                .filter(p -> p.getCreatedAt().isAfter(weekAgo))
                .count();

        long lastWeekRefunds = allCancelled.stream()
                .filter(p -> p.getCreatedAt().isAfter(twoWeeksAgo) && p.getCreatedAt().isBefore(weekAgo))
                .count();

        long refundsChange = thisWeekRefunds - lastWeekRefunds;
        stats.setRefundChangeCount(refundsChange);

        if (lastWeekRefunds > 0) {
            double percentage = ((double) refundsChange / lastWeekRefunds) * 100;
            stats.setRefundChangePercentage(percentage);
        } else {
            stats.setRefundChangePercentage(thisWeekRefunds > 0 ? 100.0 : 0.0);
        }
    }
}