package com.losdelfines.backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.losdelfines.backend.models.Pedidos;
import com.losdelfines.backend.services.PedidosService;

@RestController
@RequestMapping(path = "/pedidos/")
public class PedidosController {

    private final PedidosService pedidosService;

    @Autowired
    public PedidosController(PedidosService pedidosService) {
        this.pedidosService = pedidosService;
    }

    @GetMapping
    public List<Pedidos> getAllPedidos() {
        return pedidosService.getAllPedidos();
    }

    // Cambio
    @GetMapping("buscar")
    public List<Pedidos> getPedidos(@RequestParam Long idUsuario) {
        return pedidosService.getPedido(idUsuario);
    }

    @DeleteMapping(path = "{pedidoId}")
    public Pedidos removePedido(@PathVariable("pedidoId") Long id) {
        return pedidosService.deletePedido(id);
    }


    @DeleteMapping("borrar-pedidos")
    public void borrarPedidos() {
        pedidosService.borrarTodosLosPedidos();
    }

    @PostMapping
    public Pedidos addPedido(@RequestBody Pedidos pedido) {
        return pedidosService.addPedido(pedido);
    }

    // CAMBIO
    @PostMapping(path = "arreglo")
    public List<Pedidos> addAllPedidos(@RequestBody List<Pedidos> pedido) {
        return pedidosService.addAllPedidos(pedido);
    }

    @PutMapping(path = "{pedidoId}")
    public Pedidos updatePedido(@PathVariable("pedidoId") Long id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long precio,
            @RequestParam(required = false) Long cantidad,
            @RequestParam(required = false) String fecha,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long idUsuario) {
        return pedidosService.updatePedido(id, nombre, precio, cantidad, fecha, status, idUsuario);
    }

}