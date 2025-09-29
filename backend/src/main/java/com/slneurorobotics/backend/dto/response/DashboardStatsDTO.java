package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {

    private BigDecimal totalSalesAmount;
    private Long totalOrderCount;
    private Double salesChangePercentage;
    private BigDecimal salesChangeCount;

    private Long activeUsersCount;
    private Double activeUsersChangePercentage;
    private Long activeUsersChangeCount;
    private String averageTimeOnSite;

    private Long refundCount;
    private Double refundChangePercentage;
    private Long refundChangeCount;

    private List<DailyEarning> earningsOverview;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyEarning {
        private String day;
        private BigDecimal earnings;
    }
}