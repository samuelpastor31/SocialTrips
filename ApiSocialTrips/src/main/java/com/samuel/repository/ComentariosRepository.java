package com.samuel.repository;

import com.samuel.modelo.Comentarios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComentariosRepository extends JpaRepository<Comentarios, Integer> {
	 List<Comentarios> findByItinerariosId(int idItinerario);
}

