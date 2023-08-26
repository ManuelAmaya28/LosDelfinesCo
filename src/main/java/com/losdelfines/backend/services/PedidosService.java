package com.losdelfines.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.losdelfines.backend.models.Pedidos;
import com.losdelfines.backend.repositories.PedidosRepository;

@Service
public class PedidosService {

	private final PedidosRepository pedidosRepository;

	@Autowired
	public PedidosService(PedidosRepository pedidosRepository) {
		this.pedidosRepository = pedidosRepository;
	}

	public List<Pedidos> getAllPedidos() {
		return pedidosRepository.findAll();
	}// get todos

	public List<Pedidos> getPedido(Long idUsuario) {
		return pedidosRepository.findByIdUsuario(idUsuario);
	}// obtener una lista de idUsuario
	
	public Pedidos deletePedido(Long id) {
		Pedidos tmpPedido = null;
		if (pedidosRepository.existsById(id)) {
			tmpPedido = pedidosRepository.findById(id).get();
			pedidosRepository.deleteById(id);
		}
		return tmpPedido;
	}// borrar pedido


    public void borrarTodosLosPedidos() {
        pedidosRepository.deleteAll();
    }

	public Pedidos addPedido(Pedidos pedido) {
		return pedidosRepository.save(pedido);
	}// agregar categoria

	// CAMBIO
	public List<Pedidos> addAllPedidos(List<Pedidos> Pedidos) {
		return pedidosRepository.saveAll(Pedidos);
	}// addAllPedidos

	public Pedidos updatePedido(Long id, String nombre, Long precio, Long cantidad, String fecha, String status,
			Long idUsuario) {
		Pedidos tmpPedido = null;
		if (pedidosRepository.existsById(id)) {
			tmpPedido = pedidosRepository.findById(id).get();
			if (nombre != null)
				tmpPedido.setNombre(nombre);
			if (precio != null)
				tmpPedido.setPrecio(precio);
			if (cantidad != null)
				tmpPedido.setCantidad(cantidad);
			if (fecha != null)
				tmpPedido.setFecha(fecha);
			if (status != null)
				tmpPedido.setStatus(status);
			if (idUsuario != null)
				tmpPedido.setIdUsuario(idUsuario);
			pedidosRepository.save(tmpPedido);
		} else {
			System.out.println("Update - El pedido con el id: " + id + " no existe");
		}
		return tmpPedido;
	}// actualizar categoria

}