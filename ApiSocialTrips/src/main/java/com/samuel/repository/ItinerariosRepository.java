package com.samuel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.samuel.modelo.Itinerarios;

@Repository
public interface ItinerariosRepository extends JpaRepository<Itinerarios, Integer> {
    List<Itinerarios> findByUsuariosId(int usuarioId);
}
