package com.slneurorobotics.backend.scheduler;

import com.slneurorobotics.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class OrderCleanupScheduler {

    private final OrderService orderService;

    @Scheduled(cron = "0 */30 * * * *")
    public void runCleanup() {
        orderService.cleanupExpiredOrders();
    }
}
