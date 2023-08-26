package com.losdelfines.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.losdelfines.backend.services.PedidosService;

@Configuration
@EnableScheduling
public class ScheduledTasks {

    @Autowired
    private PedidosService pedidosService;

    @Scheduled(cron = "0 0 2 * * SUN")
    public void borrarPedidosScheduledTask() {
        pedidosService.borrarTodosLosPedidos();
        System.out.println("Tabla 'Pedidos' borrada el domingo a las 2:00 AM");
    }
}
