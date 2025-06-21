package com.samuel.repository;

import com.samuel.modelo.Usuarios;
import com.samuel.modeloDTO.UsuariosDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios, Integer> {
    @Query(value = "Select * from usuarios where nombre_usuario = ?", nativeQuery = true)
    Usuarios findByNombre(String nombre);

    @Query("SELECT new com.samuel.modeloDTO.UsuariosDTO(u.id, u.nombreUsuario, u.correoElectronico, u.fotoPerfil, u.fechaRegistro) FROM Usuarios u WHERE u.nombreUsuario = ?1")
    UsuariosDTO findByNombreDTO(String nombre);
}