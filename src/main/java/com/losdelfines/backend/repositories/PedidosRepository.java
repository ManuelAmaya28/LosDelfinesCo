package com.losdelfines.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.losdelfines.backend.models.Pedidos;

import java.util.List;

@Repository
public interface PedidosRepository extends JpaRepository<Pedidos, Long>{
    List<Pedidos> findByIdUsuario(Long idUsuario);

  
}