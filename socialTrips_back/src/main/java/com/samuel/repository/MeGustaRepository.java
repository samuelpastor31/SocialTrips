package com.samuel.repository;

import com.samuel.modelo.MeGusta;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeGustaRepository extends JpaRepository<MeGusta, Integer> {
	 List<MeGusta> findByUsuariosIdAndItinerariosId(int userId, int itineraryId);
}
